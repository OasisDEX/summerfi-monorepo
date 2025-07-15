import { NextResponse } from 'next/server'
import { z } from 'zod'

import { validateCaptcha } from '@/features/captcha/validate-captcha'

const institutionsFormSchema = z.object({
  companyName: z
    .string()
    .nonempty('Company name is required')
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters'),
  phoneNumber: z
    .string()
    .nonempty('Phone number is required')
    .min(10, 'Phone number must be at least 10 characters')
    .max(15, 'Phone number must be less than 15 characters'),
  businessEmail: z
    .string()
    .nonempty('Email is required')
    .email('Please enter a valid email address'),
  token: z
    .string()
    .nonempty('reCAPTCHA token is required')
    .refine((token) => token.length > 0, {
      message: 'reCAPTCHA token must not be empty',
    }),
})

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      companyName: string
      phoneNumber: string
      businessEmail: string
      token: string
    }>
  },
) {
  const awaitedParams = await params

  const parsedData = institutionsFormSchema.safeParse(awaitedParams)

  if (!parsedData.success) {
    return NextResponse.json(
      { error: parsedData.error.errors.map((err) => err.message) },
      { status: 400 },
    )
  }

  const recaptchaData = await validateCaptcha(parsedData.data.token)

  if (!recaptchaData) {
    return NextResponse.json({ error: 'Invalid reCAPTCHA token' }, { status: 400 })
  }

  return NextResponse.json({ message: 'Form submitted successfully' }, { status: 200 })
}

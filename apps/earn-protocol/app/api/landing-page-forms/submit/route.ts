import { NextResponse } from 'next/server'
import { z } from 'zod'

import { validateCaptcha } from '@/features/captcha/validate-captcha'

const rwaLandingPageFormServiceUrl = 'https://getform.io/f/byvyrpna'

const rwaLandingPageSchema = z.object({
  companyName: z
    .string()
    .nonempty('Company name is required')
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters'),
  personalName: z.string().max(60, 'Personal name must be less than 60 characters').optional(),
  phoneNumber: z
    .string()
    .nonempty('Phone number is required')
    .min(6, 'Phone number must be at least 6 characters')
    .max(20, 'Phone number must be less than 20 characters'),
  businessEmail: z
    .string()
    .nonempty('Business email is required')
    .email('Please enter a valid email address'),
  primaryInterest: z.string().nonempty('Primary interest is required'),
  jobRole: z
    .string()
    .nonempty('Job role is required')
    .min(2, 'Job role must be at least 2 characters')
    .max(80, 'Job role must be less than 80 characters'),
  message: z.string().max(500, 'Message must be less than 500 characters').optional(),
  consent: z.boolean().refine((value) => value, {
    message: 'You must consent to the processing of your personal data',
  }),
  token: z
    .string()
    .nonempty('reCAPTCHA token is required')
    .refine((token) => token.length > 0, {
      message: 'reCAPTCHA token must not be empty',
    }),
})

export const POST = async (req: Request) => {
  const awaitedBody = await req.json().catch(() => {
    return null
  })

  if (!awaitedBody) {
    return NextResponse.json({ errors: ['Invalid JSON format'], success: false }, { status: 400 })
  }

  const parsedData = rwaLandingPageSchema.safeParse(awaitedBody)

  if (!parsedData.success) {
    return NextResponse.json(
      { errors: parsedData.error.errors.map((error) => error.message), success: false },
      { status: 400 },
    )
  }

  const { token, ...submittedData } = parsedData.data

  const recaptchaData = await validateCaptcha(token)

  if (!recaptchaData) {
    return NextResponse.json(
      { errors: ['Invalid reCAPTCHA token'], success: false },
      { status: 400 },
    )
  }

  try {
    const encodedBody = new URLSearchParams()

    Object.entries(submittedData).forEach(([key, value]) => {
      encodedBody.append(key, String(value))
    })

    const getFormResponse = await fetch(rwaLandingPageFormServiceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Referer: 'https://summer.fi',
      },
      body: encodedBody.toString(),
    })

    if (!getFormResponse.ok) {
      return NextResponse.json(
        { errors: ['Failed to send form data'], success: false },
        { status: 500 },
      )
    }
  } catch {
    return NextResponse.json(
      { errors: ['Failed to send form data'], success: false },
      { status: 500 },
    )
  }

  return NextResponse.json(
    { message: 'Form submitted successfully', success: true },
    { status: 200 },
  )
}

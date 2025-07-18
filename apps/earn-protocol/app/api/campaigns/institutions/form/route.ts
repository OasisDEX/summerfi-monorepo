import { NextResponse } from 'next/server'
import { z } from 'zod'

import { validateCaptcha } from '@/features/captcha/validate-captcha'

const institutionsFormServiceurl = 'https://getform.io/f/byvyrpna'

const institutionsFormSchema = z.object({
  companyName: z
    .string()
    .nonempty('Company name is required')
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters'),
  personalName: z.string().max(30, 'Personal name must be less than 30 characters').optional(),
  phoneNumber: z
    .string()
    .nonempty('Phone number is required')
    .min(10, 'Phone number must be at least 10 characters')
    .max(15, 'Phone number must be less than 15 characters'),
  businessEmail: z
    .string()
    .nonempty('Email is required')
    .email('Please enter a valid email address'),
  jobRole: z
    .string()
    .nonempty('Job role is required')
    .min(2, 'Job role must be at least 2 characters')
    .max(50, 'Job role must be less than 50 characters'),
  comments: z.string().max(500, 'Comments must be less than 500 characters').optional(),
  token: z
    .string()
    .nonempty('reCAPTCHA token is required')
    .refine((token) => token.length > 0, {
      message: 'reCAPTCHA token must not be empty',
    }),
})

export async function POST(req: Request) {
  const awaitedParams = await req.json().catch(() => {
    return NextResponse.json({ error: 'Invalid JSON format', success: false }, { status: 400 })
  })

  const parsedData = institutionsFormSchema.safeParse(awaitedParams)

  if (!parsedData.success) {
    return NextResponse.json(
      { error: parsedData.error.errors.map((err) => err.message), success: false },
      { status: 400 },
    )
  }

  const { token, ...submittedData } = parsedData.data

  const recaptchaData = await validateCaptcha(token)

  if (!recaptchaData) {
    return NextResponse.json({ error: 'Invalid reCAPTCHA token', success: false }, { status: 400 })
  }

  try {
    const formData = new FormData()

    Object.entries(submittedData).forEach(([key, value]) => {
      formData.append(key, value)
    })

    const getFormResponse = await fetch(institutionsFormServiceurl, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formData,
    })

    if (!getFormResponse.ok) {
      return NextResponse.json({ errors: ['Failed to send form data'] }, { status: 500 })
    }
  } catch (error) {
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

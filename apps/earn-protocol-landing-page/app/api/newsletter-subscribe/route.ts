import { handleNewsletterSubscription } from '@summerfi/app-earn-ui'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const emailSchema = z.object({
  email: z.string().email('Invalid email format'),
})

export async function POST(req: NextRequest) {
  const { NEWSLETTER_API_KEY, NEWSLETTER_PUBLICATION_ID } = process.env

  if (!NEWSLETTER_API_KEY || !NEWSLETTER_PUBLICATION_ID) {
    return NextResponse.json(
      { error: 'Environment newslee variables not configured properly' },
      { status: 500 },
    )
  }

  try {
    const body = await req.json()
    const { email } = emailSchema.parse(body)

    const result = await handleNewsletterSubscription({
      newsletterApiKey: NEWSLETTER_API_KEY,
      newsletterPublicationId: NEWSLETTER_PUBLICATION_ID,
      email,
    })

    return NextResponse.json(result.data || { error: result.error }, { status: result.status })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'An unexpected error occurred while subscribing to the newsletter',
      },
      { status: 500 },
    )
  }
}

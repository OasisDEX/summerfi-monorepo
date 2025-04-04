/**
 * Normalizes an email address by trimming whitespace and converting to lowercase
 * @param email - The email address to normalize
 * @returns The normalized email address
 */
const normalizeEmail = (email: string): string => {
  const [localPart, domain] = email.split('@')

  if (!localPart || !domain) {
    throw new Error('Invalid email format')
  }

  // Always remove everything after '+'
  const [normalizedLocalPart] = localPart.split('+')

  // Combine the normalized local part with the domain
  return `${normalizedLocalPart}@${domain.toLowerCase()}`
}

type UserSubscriptionStatus =
  | 'validating'
  | 'invalid'
  | 'pending'
  | 'active'
  | 'inactive'
  | 'needs_attention'

type SubscriptionResponse = {
  data: {
    id: string
    email: string
    status: UserSubscriptionStatus
    created: number
  }
  status: number
  statusText: string
}

type SubscriptionHandlerParams = {
  newsletterApiKey: string
  newsletterPublicationId: string
  email: string
}

export async function handleNewsletterSubscription({
  newsletterApiKey,
  newsletterPublicationId,
  email,
}: SubscriptionHandlerParams): Promise<{ status: number; data?: unknown; error?: string }> {
  const newsletterEndpoint = process.env.NEWSLETTER_ENDPOINT

  if (!newsletterEndpoint) {
    return { status: 500, error: 'Newsletter endpoint not configured properly' }
  }

  const normalizedEmail = normalizeEmail(email)

  const MEMBER_GET_ENDPOINT = `${newsletterEndpoint}/publications/${newsletterPublicationId}/subscriptions/by_email`
  const SUBSCRIBE_POST_ENDPOINT = `${newsletterEndpoint}/publications/${newsletterPublicationId}/subscriptions`

  const headers = {
    Authorization: `Bearer ${newsletterApiKey}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }

  try {
    // Fetch member details
    const memberResponse = await fetch(`${MEMBER_GET_ENDPOINT}/${normalizedEmail}`, {
      headers,
      method: 'GET',
    })

    if (!memberResponse.ok && memberResponse.status === 404) {
      // New subscription
      const subscriptionResponse = await fetch(SUBSCRIBE_POST_ENDPOINT, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email: normalizedEmail }),
      })

      if (!subscriptionResponse.ok) {
        const errorResponse = await subscriptionResponse.json()

        return { status: 500, error: 'unknown', data: errorResponse }
      }

      return { status: 200 }
    }

    const memberData: SubscriptionResponse = await memberResponse.json()

    if (memberData.data.status === 'pending') {
      return { status: 409, error: 'emailPending' }
    }

    if (memberData.data.status === 'active') {
      return { status: 409, error: 'emailAlreadyExists' }
    }

    // Resubscribe if inactive
    if (memberData.data.status === 'inactive') {
      const resubscribeResponse = await fetch(SUBSCRIBE_POST_ENDPOINT, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email: normalizedEmail, reactivateExisting: true }),
      })

      if (!resubscribeResponse.ok) {
        const errorResponse = await resubscribeResponse.json()

        return { status: 500, error: 'unknown', data: errorResponse }
      }

      return { status: 200 }
    }

    return { status: 500, error: 'unknown', data: memberData }
  } catch (error) {
    return { status: 500, error: error.message || 'An unexpected error occurred' }
  }
}

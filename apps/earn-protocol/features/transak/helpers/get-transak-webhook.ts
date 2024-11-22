import { getTransakUrl } from '@/features/transak/helpers/get-transak-url'
import type { TransakRefreshTokenResponse } from '@/features/transak/types'

export const getTransakWebhook = async ({
  eventId = 'ORDER_COMPLETED',
  orderId,
  accessToken,
}: {
  eventId?: string
  orderId: string
  accessToken: string
}): Promise<TransakRefreshTokenResponse | undefined> => {
  try {
    const url = getTransakUrl()

    const options = {
      method: 'GET',
      headers: { accept: 'application/json', 'access-token': accessToken },
    }

    const response = await fetch(
      `${url}/partners/api/v2/webhooks?eventID=${eventId}&orderID=${orderId}`,
      options,
    )

    return await response.json()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to generate transak access token', error)

    return undefined
  }
}

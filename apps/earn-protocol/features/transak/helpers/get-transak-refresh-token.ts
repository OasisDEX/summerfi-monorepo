import { transakPublicApiKey } from '@/features/transak/consts'
import { type TransakRefreshTokenResponse } from '@/features/transak/types'

export const getTransakRefreshToken = async (): Promise<
  TransakRefreshTokenResponse | undefined
> => {
  try {
    if (!transakPublicApiKey) {
      throw new Error('ENV variable missing')
    }

    const response = await fetch(`/api/transak/refresh-token`, {
      method: 'GET',
      headers: { 'x-partner-api-key': transakPublicApiKey },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch refresh token: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to generate transak access token', error)

    return undefined
  }
}

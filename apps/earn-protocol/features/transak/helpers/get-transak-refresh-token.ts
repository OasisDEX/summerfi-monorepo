import { CACHE_TIMES } from '@/constants/revalidation'
import { transakPublicApiKey } from '@/features/transak/consts'
import { type TransakRefreshTokenResponse } from '@/features/transak/types'

/**
 * Fetches the Transak refresh token from the API.
 *
 * @returns {Promise<TransakRefreshTokenResponse | undefined>} A promise that resolves to the response containing the refresh token or undefined if an error occurs.
 * @throws {Error} If the environment variable for the Transak public API key is missing or if the fetch request fails.
 */
export const getTransakRefreshToken = async (): Promise<
  TransakRefreshTokenResponse | undefined
> => {
  try {
    if (!transakPublicApiKey) {
      throw new Error('ENV variable missing')
    }

    const response = await fetch(`/earn/api/transak/refresh-token`, {
      method: 'GET',
      headers: { 'x-partner-api-key': transakPublicApiKey },
      next: {
        revalidate: CACHE_TIMES.ALWAYS_FRESH,
      },
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

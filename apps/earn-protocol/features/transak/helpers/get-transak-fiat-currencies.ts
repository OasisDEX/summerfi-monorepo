import { CACHE_TIMES } from '@/constants/revalidation'
import { transakPublicApiKey } from '@/features/transak/consts'
import { type TransakFiatCurrenciesResponse } from '@/features/transak/types'

/**
 * Fetches the available fiat currencies from the Transak API.
 *
 * @returns {Promise<TransakFiatCurrenciesResponse | undefined>} A promise that resolves to the response containing the fiat currencies or undefined if an error occurs.
 * @throws {Error} If the environment variable for the Transak public API key is missing or if the fetch request fails.
 */
export const getTransakFiatCurrencies = async (): Promise<
  TransakFiatCurrenciesResponse | undefined
> => {
  try {
    if (!transakPublicApiKey) {
      throw new Error('ENV variable missing')
    }

    const response = await fetch(`/earn/api/transak/fiat-currencies`, {
      method: 'GET',
      headers: { 'x-partner-api-key': transakPublicApiKey },
      next: {
        revalidate: CACHE_TIMES.ALWAYS_FRESH,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch fiat currencies: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch fiat currencies', error)

    return undefined
  }
}

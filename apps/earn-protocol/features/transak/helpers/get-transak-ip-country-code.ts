import { getCookies } from '@/constants/get-cookies'
import { CACHE_TIMES } from '@/constants/revalidation'
import { transakProductionUrl } from '@/features/transak/consts'
import { type TransakIpCountryCodeResponse } from '@/features/transak/types'

/**
 * Fetches the IP country code from the Transak API.
 *
 * @returns {Promise<TransakIpCountryCodeResponse | undefined>} A promise that resolves to the IP country code response or undefined if an error occurs.
 */
export const getTransakIpCountryCode = async (): Promise<
  TransakIpCountryCodeResponse | undefined
> => {
  try {
    const country = getCookies('country')

    // If the country is already set in the cookies, return it
    if (country) {
      return { ipCountryCode: country }
    }

    const options = {
      method: 'GET',
      headers: { accept: 'application/json' },
      next: {
        revalidate: CACHE_TIMES.ALWAYS_FRESH,
      },
    }

    const response = await fetch(`${transakProductionUrl}/fiat/public/v1/get/country`, options)

    if (!response.ok) {
      throw new Error(`Failed to fetch ip country code: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch ip country code', error)

    return undefined
  }
}

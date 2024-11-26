import { transakProductionUrl } from '@/features/transak/consts'
import { type TransakIpCountryCodeResponse } from '@/features/transak/types'

export const getTransakIpCountryCode = async (): Promise<
  TransakIpCountryCodeResponse | undefined
> => {
  try {
    if (!transakProductionUrl) {
      throw new Error('ENV variable missing')
    }
    const options = { method: 'GET', headers: { accept: 'application/json' } }

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

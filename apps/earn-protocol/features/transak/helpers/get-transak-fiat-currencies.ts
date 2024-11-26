import { transakPublicApiKey } from '@/features/transak/consts'
import { type TransakFiatCurrenciesResponse } from '@/features/transak/types'

export const getTransakFiatCurrencies = async (): Promise<
  TransakFiatCurrenciesResponse | undefined
> => {
  try {
    if (!transakPublicApiKey) {
      throw new Error('ENV variable missing')
    }

    const response = await fetch(`/api/transak/fiat-currencies`, {
      method: 'GET',
      headers: { 'x-partner-api-key': transakPublicApiKey },
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

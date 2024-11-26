import { transakPublicApiKey } from '@/features/transak/consts'
import { getTransakUrl } from '@/features/transak/helpers/get-transak-url'
import { type TransakAction, type TransakPaymentOptions } from '@/features/transak/types'

export const getTransakPricingUrl = ({
  fiatCurrency,
  cryptoCurrency,
  isBuyOrSell,
  network,
  paymentMethod,
  fiatAmount,
  ipCountryCode,
}: {
  fiatCurrency: string
  cryptoCurrency: string
  isBuyOrSell: TransakAction
  network: string
  paymentMethod: TransakPaymentOptions
  fiatAmount: string
  ipCountryCode: string | undefined
}) => {
  if (!transakPublicApiKey) {
    throw new Error('ENV variable missing')
  }

  return `${getTransakUrl()}/api/v1/pricing/public/quotes?${new URLSearchParams({
    partnerApiKey: transakPublicApiKey,
    fiatCurrency,
    cryptoCurrency,
    isBuyOrSell,
    network,
    paymentMethod,
    fiatAmount,
    // this param is optional, but when defined
    // exchange details will be more precise
    quoteCountryCode: ipCountryCode ?? '',
  }).toString()}`
}

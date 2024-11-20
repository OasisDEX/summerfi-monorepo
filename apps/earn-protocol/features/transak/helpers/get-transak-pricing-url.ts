import { transakPublicApiKey } from '@/features/transak/consts'
import { getTransakUrl } from '@/features/transak/helpers/get-transak-url'
import { type TransakPaymentOptions } from '@/features/transak/types'

export const getTransakPricingUrl = ({
  fiatCurrency,
  cryptoCurrency,
  isBuyOrSell,
  network,
  paymentMethod,
  fiatAmount,
}: {
  fiatCurrency: string
  cryptoCurrency: string
  isBuyOrSell: 'BUY' | 'SELL'
  network: string
  paymentMethod: TransakPaymentOptions
  fiatAmount: string
}) =>
  `${getTransakUrl()}/api/v1/pricing/public/quotes?partnerApiKey=${transakPublicApiKey}&fiatCurrency=${fiatCurrency}&cryptoCurrency=${cryptoCurrency}&isBuyOrSell=${isBuyOrSell}&network=${network}&paymentMethod=${paymentMethod}&fiatAmount=${fiatAmount}`

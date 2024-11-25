import { type TransakAction, type TransakPaymentOptions } from '@/features/transak/types'

export const getTransakConfigInitData = ({
  fiatAmount,
  productsAvailed,
  paymentMethod,
  cryptoCurrencyCode,
  fiatCurrency,
}: {
  fiatAmount: string
  productsAvailed: TransakAction
  paymentMethod: TransakPaymentOptions
  cryptoCurrencyCode: string
  fiatCurrency: string
}) => ({
  fiatAmount: Number(fiatAmount),
  cryptoCurrencyCode,
  productsAvailed,
  paymentMethod,
  fiatCurrency,
})

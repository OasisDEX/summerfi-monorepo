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
}) => {
  const parsedAmount = Number(fiatAmount)

  if (Number.isNaN(parsedAmount)) {
    throw new Error('Invalid fiat amount provided')
  }

  return {
    fiatAmount: parsedAmount,
    cryptoCurrencyCode,
    productsAvailed,
    paymentMethod,
    fiatCurrency,
  }
}

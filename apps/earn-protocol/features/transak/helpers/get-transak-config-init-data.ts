import { type TransakAction, type TransakPaymentOptions } from '@/features/transak/types'

/**
 * Generates the initial configuration data for Transak.
 *
 * @param {Object} params - The parameters for the configuration.
 * @param {string} params.fiatAmount - The amount of fiat currency.
 * @param {TransakAction} params.productsAvailed - The products availed in the transaction.
 * @param {TransakPaymentOptions} params.paymentMethod - The payment method used.
 * @param {string} params.cryptoCurrencyCode - The code of the cryptocurrency.
 * @param {string} params.fiatCurrency - The fiat currency used.
 * @returns {Object} The initial configuration data for Transak.
 * @throws {Error} If the fiat amount is invalid.
 */
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
}): {
  fiatAmount: number
  productsAvailed: TransakAction
  paymentMethod: TransakPaymentOptions
  cryptoCurrencyCode: string
  fiatCurrency: string
} => {
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

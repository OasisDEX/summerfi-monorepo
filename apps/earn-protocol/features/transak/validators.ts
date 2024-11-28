import type { Dispatch } from 'react'

import {
  type TransakFiatCurrencies,
  type TransakPaymentOptions,
  type TransakReducerAction,
} from '@/features/transak/types'

/**
 * Validates the Transak fiat input.
 *
 * @param {Object} params - The parameters for validation.
 * @param {string} params.amount - The amount to validate.
 * @param {Dispatch<TransakReducerAction>} params.dispatch - The dispatch function to update the state.
 * @param {TransakFiatCurrencies} params.fiatCurrencies - The list of fiat currencies.
 * @param {string} params.fiatCurrency - The selected fiat currency.
 * @param {TransakPaymentOptions} params.paymentMethod - The selected payment method.
 */
export const validateTransakFiatInput = ({
  amount,
  dispatch,
  fiatCurrencies,
  fiatCurrency,
  paymentMethod,
}: {
  amount: string
  dispatch: Dispatch<TransakReducerAction>
  fiatCurrencies: TransakFiatCurrencies
  fiatCurrency: string
  paymentMethod: TransakPaymentOptions
}) => {
  const paymentMethodData = fiatCurrencies
    .find((item) => item.symbol === fiatCurrency)
    ?.paymentOptions.find((item) => item.id === paymentMethod)

  const maxAmount = paymentMethodData?.maxAmount
  const minAmount = paymentMethodData?.minAmount

  if (maxAmount && Number(amount) > maxAmount) {
    dispatch({
      type: 'update-error',
      payload: `Maximum amount for this payment method is ${maxAmount}`,
    })
  }

  if (minAmount && Number(amount) < minAmount) {
    dispatch({
      type: 'update-error',
      payload: `Minimum amount for this payment method is ${minAmount}`,
    })
  }
}

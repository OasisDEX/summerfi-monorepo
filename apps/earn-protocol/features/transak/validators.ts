import type { Dispatch } from 'react'

import {
  type TransakFiatCurrencies,
  type TransakPaymentOptions,
  type TransakReducerAction,
} from '@/features/transak/types'

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

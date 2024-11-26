import {
  TransakAction,
  TransakPaymentOptions,
  type TransakReducerAction,
  type TransakReducerState,
  TransakSteps,
} from '@/features/transak/types'

export const transakInitialReducerState: TransakReducerState = {
  step: TransakSteps.INITIAL,
  fiatAmount: '0',
  paymentMethod: TransakPaymentOptions.CREDIT_DEBIT_CARD,
  fiatCurrency: 'USD',
  isBuyOrSell: TransakAction.BUY,
  exchangeDetails: undefined,
  eventOrderData: undefined,
  orderData: undefined,
  ipCountryCode: undefined,
  fiatCurrencies: undefined,
  // dummy just for initialization which will be overwritten on first render
  cryptoCurrency: 'USDC',
  error: '',
}

export const transakReducer = (
  prevState: TransakReducerState,
  action: TransakReducerAction,
): TransakReducerState => {
  switch (action.type) {
    case 'update-ip-country-code':
      return { ...prevState, ipCountryCode: action.payload }
    case 'update-fiat-currencies':
      return { ...prevState, fiatCurrencies: action.payload }
    case 'update-step':
      return { ...prevState, step: action.payload }
    case 'update-fiat-amount':
      return {
        ...prevState,
        fiatAmount: action.payload === '' ? '0' : action.payload.replaceAll(',', ''),
      }
    case 'update-payment-method':
      return { ...prevState, paymentMethod: action.payload }
    case 'update-fiat-currency':
      return { ...prevState, fiatCurrency: action.payload }
    case 'update-crypto-currency':
      return { ...prevState, cryptoCurrency: action.payload }
    case 'update-exchange-details':
      return { ...prevState, exchangeDetails: action.payload }
    case 'update-event-order-data':
      return { ...prevState, eventOrderData: action.payload }
    case 'update-order-data':
      return { ...prevState, orderData: action.payload }
    case 'update-error':
      return { ...prevState, error: action.payload }
    default:
      return prevState
  }
}

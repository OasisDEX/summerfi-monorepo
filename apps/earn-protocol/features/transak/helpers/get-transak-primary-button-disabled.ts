import { type TransakReducerState, TransakSteps } from '@/features/transak/types'

export const getTransakPrimaryButtonDisabled = ({ state }: { state: TransakReducerState }) => {
  switch (state.step) {
    case TransakSteps.INITIAL:
      return !state.fiatCurrencies
    case TransakSteps.EXCHANGE:
      return !!state.error || state.fiatAmount === '0' || !state.exchangeDetails
    default:
      return false
  }
}

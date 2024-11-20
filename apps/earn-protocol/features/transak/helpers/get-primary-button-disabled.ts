import { type TransakReducerState, TransakSteps } from '@/features/transak/types'

export const getTransakPrimaryButtonDisabled = ({
  step,
  state,
}: {
  step: TransakSteps
  state: TransakReducerState
}) => {
  switch (step) {
    case TransakSteps.EXCHANGE:
      return !!state.error || state.fiatAmount === '0'
    default:
      return false
  }
}

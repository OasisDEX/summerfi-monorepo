import { type TransakReducerState, TransakSteps } from '@/features/transak/types'

export const getTransakPrimaryButtonLabel = ({ state }: { state: TransakReducerState }) => {
  switch (state.step) {
    case TransakSteps.INITIAL:
      return 'Continue'
    case TransakSteps.ABOUT_KYC:
      return 'Get started'
    case TransakSteps.EXCHANGE:
      return 'Buy now'
    case TransakSteps.BUY_ETH:
      return 'Buy ETH'
    case TransakSteps.ORDER:
      return 'Go to deposit'
    default:
      return `Unknown step: ${state.step}`
  }
}

import { TransakSteps } from '@/features/transak/types'

export const getTransakPrimaryButtonHidden = ({ step }: { step: TransakSteps }) => {
  switch (step) {
    case TransakSteps.INITIAL:
    case TransakSteps.ABOUT_KYC:
    case TransakSteps.EXCHANGE:
    case TransakSteps.ORDER:
    case TransakSteps.BUY_ETH:
      return false
    default:
      return true
  }
}

import { TransakSteps } from '@/features/transak/types'

export const getTransakPrimaryButtonHidden = ({ step }: { step: TransakSteps }) => {
  switch (step) {
    case TransakSteps.INITIAL:
    case TransakSteps.ABOUT_KYC:
    case TransakSteps.EXCHANGE:
      return false
    default:
      return true
  }
}

import { TransakSteps } from '@/features/transak/types'

export const getTransakPrimaryButtonLabel = ({ step }: { step: TransakSteps }) => {
  switch (step) {
    case TransakSteps.INITIAL:
      return 'Continue'
    case TransakSteps.ABOUT_KYC:
      return 'Get started'
    case TransakSteps.EXCHANGE:
      return 'Buy now'
    default:
      return 'Define me'
  }
}

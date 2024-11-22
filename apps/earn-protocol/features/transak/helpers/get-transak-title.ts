import { TransakSteps } from '@/features/transak/types'

export const getTransakTitle = ({ step }: { step: TransakSteps }) => {
  switch (step) {
    case TransakSteps.INITIAL:
      return 'Add funds via Transak'
    case TransakSteps.ABOUT_KYC:
      return 'About KYC'
    case TransakSteps.EXCHANGE:
      return 'Buy crypto to your wallet'
    case TransakSteps.KYC:
      return 'KYC Process'
    case TransakSteps.ORDER:
      return 'Payment Authorization'
    default:
      return 'Define me'
  }
}

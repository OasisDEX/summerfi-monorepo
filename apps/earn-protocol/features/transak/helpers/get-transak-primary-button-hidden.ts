import { TransakSteps } from '@/features/transak/types'

/**
 * Determines if the primary button should be hidden based on the current step.
 *
 * @param {TransakSteps} step - The current step in the Transak process.
 * @returns {boolean} - Returns `true` if the primary button should be hidden, otherwise `false`.
 */
export const getTransakPrimaryButtonHidden = ({ step }: { step: TransakSteps }): boolean => {
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

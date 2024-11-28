import { type TransakReducerState, TransakSteps } from '@/features/transak/types'

/**
 * Returns the label for the primary button based on the current state.
 *
 * @param {Object} params - The parameters for generating the button label.
 * @param {TransakReducerState} params.state - The current state of the Transak reducer.
 * @returns {string} - The label for the primary button.
 */
export const getTransakPrimaryButtonLabel = ({ state }: { state: TransakReducerState }): string => {
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

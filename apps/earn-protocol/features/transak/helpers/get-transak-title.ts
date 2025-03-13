import { transakFailedOrderStatuses } from '@/features/transak/consts'
import {
  TransakOrderDataStatus,
  type TransakReducerState,
  TransakSteps,
} from '@/features/transak/types'

/**
 * Returns the title based on the current state of the Transak reducer.
 *
 * @param {Object} params - The parameters for generating the title.
 * @param {TransakReducerState} params.state - The current state of the Transak reducer.
 * @returns {string} - The title based on the current state.
 */
export const getTransakTitle = ({ state }: { state: TransakReducerState }): string => {
  switch (state.step) {
    case TransakSteps.INITIAL:
      return 'Buy crypto via Transak'
    case TransakSteps.ABOUT_KYC:
      return 'About KYC'
    case TransakSteps.BUY_ETH:
      return 'Buy ETH for gas fee'
    case TransakSteps.SWITCH_TO_L2:
      return 'Switch to Layer 2 networks'
    case TransakSteps.EXCHANGE:
      return 'Buy crypto to your wallet'
    case TransakSteps.KYC:
      return 'KYC Process'
    case TransakSteps.ORDER:
      return state.orderData && state.orderData.data.status === TransakOrderDataStatus.COMPLETED
        ? 'Transaction completed'
        : state.orderData && transakFailedOrderStatuses.includes(state.orderData.data.status)
          ? 'Transaction failed'
          : 'Transaction in progress'
    default:
      return `Unknown step: ${state.step}`
  }
}

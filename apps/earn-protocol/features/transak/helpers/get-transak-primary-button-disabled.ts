import { type TransakReducerState, TransakSteps } from '@/features/transak/types'

/**
 * Determines if the primary button in the Transak widget should be disabled based on the current state.
 *
 * @param {TransakReducerState} state - The current state of the Transak widget.
 * @returns {boolean} - Returns true if the primary button should be disabled, otherwise false.
 *
 * The primary button is disabled in the following cases:
 * - When the current step is INITIAL and fiat currencies are not available.
 * - When the current step is EXCHANGE and there is an error, the fiat amount is '0', or exchange details are not available.
 * - For all other steps, the primary button is not disabled.
 */
export const getTransakPrimaryButtonDisabled = ({
  state,
}: {
  state: TransakReducerState
}): boolean => {
  switch (state.step) {
    case TransakSteps.INITIAL:
      return !state.fiatCurrencies
    case TransakSteps.EXCHANGE:
      return !!state.error || state.fiatAmount === '0' || !state.exchangeDetails
    default:
      return false
  }
}

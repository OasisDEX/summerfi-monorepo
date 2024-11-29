import { type TransakReducerState } from '@/features/transak/types'

/**
 * Determines if the Transak widget is in a loading state.
 *
 * @param {TransakReducerState} state - The current state of the Transak reducer.
 * @returns {boolean} - Returns true if the widget is loading, otherwise false.
 *
 * The widget is considered to be in a loading state if:
 * - The fiat amount is greater than 0 and exchange details are not available, or
 * - Fiat currencies are not available, and there is no error in the state.
 */
export const getTransakIsLoading = ({ state }: { state: TransakReducerState }): boolean =>
  ((Number(state.fiatAmount) > 0 && !state.exchangeDetails) || !state.fiatCurrencies) &&
  !state.error

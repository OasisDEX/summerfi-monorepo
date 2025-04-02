import type { Dispatch, SetStateAction } from 'react'
import { type TOSState, TOSStatus } from '@summerfi/app-types'

/**
 * Wraps an asynchronous function to handle errors and update state accordingly.
 *
 * @remarks
 * This method wraps a given asynchronous function, attempting to execute it.
 * If the function fails, it catches the error, logs it, and updates the state to retry the action.
 *
 * @param fn - The asynchronous function to be executed.
 * @param setTos - A state dispatcher function to update the Terms of Service (TOS) state.
 * @param actionStatus - The current status of the TOS action.
 *
 * @returns A wrapped asynchronous function that handles errors and updates state on failure.
 */
export const actionErrorWrapper =
  ({
    fn,
    setTos,
    actionStatus,
  }: {
    fn: () => Promise<void>
    setTos: Dispatch<SetStateAction<TOSState>>
    actionStatus: TOSStatus
  }) =>
  async (): Promise<void> => {
    try {
      await fn()
    } catch (error) {
      /**
         Go to retry step with the same action that failed.
         */
      // eslint-disable-next-line no-console
      console.error(
        `Terms of service flow failed on ${actionStatus} step - please retry or contact with support`,
        error,
      )
      setTos({
        status: TOSStatus.RETRY,
        action: actionErrorWrapper({ fn: () => fn(), setTos, actionStatus }),
        error: `${error}`,
      })
    }
  }

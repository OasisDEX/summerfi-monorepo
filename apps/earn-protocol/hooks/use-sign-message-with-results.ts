import { useCallback, useRef } from 'react'
import { useSignMessage, type useSmartAccountClient } from '@account-kit/react'

type SignMessageParams = {
  message: string
}

type UseSignMessageHook = {
  signMessage: (params: SignMessageParams) => void
}

/**
 * Custom hook to sign a message and return the result as a Promise.
 *
 * @param {ReturnType<typeof useSmartAccountClient>['client']} client - The client instance from useSmartAccountClient.
 * @returns {{ signMessageWithResult: (message: string) => Promise<string> }} - An object containing the signMessageWithResult function.
 */
export const useSignMessageWithResult = (
  client: ReturnType<typeof useSmartAccountClient>['client'],
): { signMessageWithResult: (message: string) => Promise<string> } => {
  // Define refs for the resolve/reject handlers
  const resolvePromiseRef = useRef<((value: string) => void) | null>(null)
  const rejectPromiseRef = useRef<((reason: unknown) => void) | null>(null)

  /**
   * Resets the promise handlers.
   */
  const resetPromiseHandlers = () => {
    resolvePromiseRef.current = null
    rejectPromiseRef.current = null
  }

  const { signMessage } = useSignMessage({
    client,
    onSuccess: (result: string) => {
      if (resolvePromiseRef.current) {
        resolvePromiseRef.current(result) // Resolve the promise
        resetPromiseHandlers()
      }
    },
    onError: (error: Error) => {
      if (rejectPromiseRef.current) {
        rejectPromiseRef.current(error) // Reject the promise
        resetPromiseHandlers()
      }
    },
  }) as UseSignMessageHook

  /**
   * Wraps the signMessage call in a Promise.
   *
   * @param {string} message - The message to be signed.
   * @returns {Promise<string>} - A promise that resolves with the signed message or rejects with an error.
   */
  const signMessageWithResult = (message: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      resolvePromiseRef.current = resolve
      rejectPromiseRef.current = reject

      try {
        signMessage({ message }) // Trigger the signing process
      } catch (error) {
        reject(error) // Handle immediate errors
        resetPromiseHandlers()
      }
    })
  }

  const memoizedSignMessageWithResult = useCallback(signMessageWithResult, [])

  return { signMessageWithResult: memoizedSignMessageWithResult }
}

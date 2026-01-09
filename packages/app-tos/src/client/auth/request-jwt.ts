'use client'
import SafeAppsSDK from '@safe-global/safe-apps-sdk'

import { getGnosisSafeDetails } from '@/client/auth/gnosis/get-gnosis-safe-details'
import { requestChallenge } from '@/client/auth/request-challenge'
import { requestSignin } from '@/client/auth/request-signin'
import { signTypedPayload } from '@/client/helpers/sign-typed-payload'
import { type TOSMessageType, type TOSSignMessage } from '@/types'

/**
 * Requests a JSON Web Token (JWT) by signing a challenge.
 *
 * @remarks
 * This method first requests a challenge from the server. If the wallet is a Gnosis Safe, it retrieves Gnosis Safe details and
 * polls for an off-chain signature to request a sign-in. Otherwise, it uses the provided signing function to sign the challenge
 * and request a sign-in.
 *
 * @param signMessage - The function used to sign the challenge message.
 * @param chainId - The chain ID of the blockchain network.
 * @param walletAddress - The wallet address to be used for signing.
 * @param isGnosisSafe - A boolean indicating if the wallet is a Gnosis Safe.
 * @param cookiePrefix - The prefix of cookie that will be stored as http-only cookie.
 * @param host - Optional, to be used when API is not available under the same host (for example localhost development on different ports).
 *
 * @returns A promise that resolves to the JWT string or undefined if an error occurs.
 * @throws Will throw an error if the challenge request fails or if signing with Gnosis Safe fails.
 */
export async function requestJWT({
  signMessage,
  chainId,
  walletAddress,
  isGnosisSafe,
  cookiePrefix,
  type,
  host,
}: {
  signMessage: TOSSignMessage
  chainId: number
  walletAddress: string
  isGnosisSafe: boolean
  cookiePrefix: string
  type: TOSMessageType
  host?: string
}): Promise<string | undefined> {
  const challenge = await requestChallenge({ walletAddress, isGnosisSafe, host })

  if (!challenge) {
    throw new Error('Request challenge failed, try again or contact with support')
  }

  if (isGnosisSafe) {
    const sdk = new SafeAppsSDK()

    const { challenge: gnosisSafeChallenge, messageHash } = await getGnosisSafeDetails(
      sdk,
      chainId,
      walletAddress,
      challenge,
      type,
    )

    // start polling
    const token = await new Promise<string | undefined>((resolve) => {
      // Resolve helper that always clears timers before finishing the promise
      let returnValue = (val: string | undefined) => resolve(val) // CAUTION: this function is reassigned later

      const interval = setInterval(async () => {
        if (messageHash) {
          try {
            const offchainSignature = await sdk.safe.getOffChainSignature(messageHash)

            if (offchainSignature === '') {
              throw new Error('GnosisSafe: not ready')
            }
            const safeJwt = await requestSignin({
              challenge: gnosisSafeChallenge,
              signature: offchainSignature,
              chainId,
              isGnosisSafe,
              cookiePrefix,
              host,
              type,
            })

            return returnValue(safeJwt)
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('GnosisSafe: error occurred', error)
          }
        }

        return undefined
      }, 5 * 1000)

      // Safety net: stop polling after 120 seconds to avoid leaking intervals
      const timeout = setTimeout(() => {
        returnValue(undefined)
      }, 120_000)

      // clear all scheduled callbacks
      returnValue = (val: string | undefined) => {
        clearInterval(interval)
        clearTimeout(timeout)
        resolve(val)
      }
    })

    if (!token) {
      throw new Error(`GnosisSafe: failed to sign`)
    }

    return token
  }

  const signature = await signTypedPayload(challenge, signMessage, type)

  if (!signature) {
    throw new Error('Signing process declined or failed, try again or contact with support')
  }

  return await requestSignin({
    challenge,
    signature,
    chainId,
    isGnosisSafe: false,
    cookiePrefix,
    host,
    type,
  })
}

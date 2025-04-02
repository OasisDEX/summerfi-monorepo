import { TOSStatus } from '@summerfi/app-types'

import { requestJWT } from '@/client/auth/request-jwt'
import { acceptanceStep } from '@/client/helpers/acceptance-step'
import { actionErrorWrapper } from '@/client/helpers/action-error-wrapper'
import {
  type TOSInput,
  type TOSMessageType,
  type TosUpdate,
  type TOSVerifyAcceptance,
} from '@/types'

/**
 * Manages the signature step in the Terms of Service (TOS) flow.
 *
 * @remarks
 * This function updates the TOS state to indicate it is waiting for a signature, then attempts to generate a JWT by
 * signing a challenge. If successful, it proceeds to the acceptance step. If the JWT generation fails, it throws an error.
 *
 * @param setTos - A function to update the TOS state.
 * @param signMessage - The function used to sign the challenge message.
 * @param chainId - The chain ID of the blockchain network.
 * @param termsOfServiceAcceptance - An object representing the terms of service acceptance status.
 * @param walletAddress - The wallet address of the user.
 * @param version - The version of the terms of service document.
 * @param cookiePrefix - The prefix of cookie that will be stored as http-only cookie.
 * @param host - Optional, to be used when API is not available under the same host (for example localhost development on different ports).
 * @param isGnosisSafe - A boolean indicating if the wallet is a Gnosis Safe.
 * @param type - The type of Terms of Service message to generate.
 */

export const signatureStep = ({
  setTos,
  signMessage,
  chainId,
  termsOfServiceAcceptance,
  walletAddress,
  version,
  cookiePrefix,
  host,
  isGnosisSafe,
  type,
}: Omit<TOSInput, 'publicClient' | 'isSmartAccount'> & {
  setTos: TosUpdate
  termsOfServiceAcceptance: TOSVerifyAcceptance
  walletAddress: string
  type: TOSMessageType
}): void => {
  setTos({
    status: TOSStatus.WAITING_FOR_SIGNATURE,
    action: actionErrorWrapper({
      fn: async () => {
        setTos({
          status: TOSStatus.LOADING,
          previousStatus: TOSStatus.WAITING_FOR_SIGNATURE,
        })
        const jwt = await requestJWT({
          signMessage,
          chainId,
          walletAddress,
          isGnosisSafe,
          cookiePrefix,
          host,
          type,
        })

        if (jwt) {
          acceptanceStep({
            setTos,
            termsOfServiceAcceptance,
            walletAddress,
            version,
            cookiePrefix,
            host,
          })
        } else {
          throw Error('Failed to generate JWT, try again or contact with Support.')
        }
      },
      setTos,
      actionStatus: TOSStatus.WAITING_FOR_SIGNATURE,
    }),
  })
}

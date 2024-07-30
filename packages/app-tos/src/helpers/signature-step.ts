import { TOSStatus } from '@summerfi/app-types'

import { requestJWT } from '@/auth/request-jwt'
import { acceptanceStep } from '@/helpers/acceptance-step'
import { actionErrorWrapper } from '@/helpers/action-error-wrapper'
import { type TOSInput, type TosUpdate, type TOSVerifyAcceptance } from '@/types'

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
 * @param host - Optional, to be used when API is not available under the same host (for example localhost development on different ports).
 * @param isGnosisSafe - A boolean indicating if the wallet is a Gnosis Safe.
 */

export const signatureStep = ({
  setTos,
  signMessage,
  chainId,
  termsOfServiceAcceptance,
  walletAddress,
  version,
  host,
  isGnosisSafe,
}: TOSInput & {
  setTos: TosUpdate
  termsOfServiceAcceptance: TOSVerifyAcceptance
  walletAddress: string
}) => {
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
          host,
        })

        if (jwt) {
          acceptanceStep({ setTos, termsOfServiceAcceptance, walletAddress, version, host })
        } else {
          throw Error('Failed to generate JWT, try again or contact with Support.')
        }
      },
      setTos,
      actionStatus: TOSStatus.WAITING_FOR_SIGNATURE,
    }),
  })
}

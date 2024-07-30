import { TOSStatus } from '@summerfi/app-types'

import { actionErrorWrapper } from '@/helpers/action-error-wrapper'
import { saveTermsOfServiceAcceptance } from '@/tos/save-terms-of-service-acceptance'
import { type TOSInput, type TosUpdate, type TOSVerifyAcceptance } from '@/types'

/**
 * Manages the acceptance step in the Terms of Service (TOS) flow.
 *
 * @remarks
 * This function updates the TOS state to indicate it is waiting for acceptance, then attempts to save the terms of service acceptance.
 * If successful, it updates the TOS state to indicate completion. If the save fails, it handles the error and updates the state accordingly.
 *
 * @param setTos - A function to update the TOS state.
 * @param termsOfServiceAcceptance - An object representing the terms of service acceptance status.
 * @param walletAddress - The wallet address of the user.
 * @param version - The version of the terms of service document.
 * @param host - Optional, to be used when API is not available under the same host (for example localhost development on different ports).
 */
export const acceptanceStep = ({
  setTos,
  termsOfServiceAcceptance,
  walletAddress,
  version,
  host,
}: Pick<TOSInput, 'version' | 'host'> & {
  setTos: TosUpdate
  walletAddress: string
  termsOfServiceAcceptance: TOSVerifyAcceptance
}) => {
  const newStatus = termsOfServiceAcceptance.updated
    ? TOSStatus.WAITING_FOR_ACCEPTANCE_UPDATED
    : TOSStatus.WAITING_FOR_ACCEPTANCE

  setTos({
    status: newStatus,
    action: actionErrorWrapper({
      fn: async () => {
        setTos({ status: TOSStatus.LOADING, previousStatus: newStatus })
        /**
          ToS api calls to save / update signature
        */
        const { docVersion } = await saveTermsOfServiceAcceptance({
          walletAddress,
          version,
          host,
        })

        if (docVersion) {
          setTos({
            status: TOSStatus.DONE,
          })
        }
      },
      setTos,
      actionStatus: newStatus,
    }),
  })
}

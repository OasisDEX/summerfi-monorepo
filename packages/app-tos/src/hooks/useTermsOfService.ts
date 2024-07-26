'use client'
import { useEffect, useState } from 'react'

import { requestJWT } from '@/auth/request-jwt'
import { actionErrorWrapper } from '@/helpers/action-error-wrapper'
import { saveTermsOfServiceAcceptance } from '@/tos/save-terms-of-service-acceptance'
import { verifyTermsOfServiceAcceptance } from '@/tos/verify-terms-of-service-acceptance'
import { type TOSInput, type TOSState, TOSStatus } from '@/types'

/**
 * Summer.fi Terms of Service hook
 *
 * @remarks
 * This hooks assume that there is API running on the same host (if not, `host` parameter should be defined and CORS configured)
 * with proper handling of all endpoints that are being called (`/api/tos/*`, `/api/auth/signin`).
 *
 * @param signMessage - web3 sign handler required for on-chain signature, should be memoized on the client level
 * @param chainId - chain id, i.e. 1 (ethereum mainnet)
 * @param walletAddress - user wallet address
 * @param version - Terms of Service version
 * @param isGnosisSafe - boolean to determine whether user use safe multi-sig
 * @param host - Optional, to be used when API is not available under the same host (for example localhost development on different ports).
 *
 * @returns Returns state of Terms of Service flow
 *
 */
export const useTermsOfService = ({
  signMessage,
  chainId,
  walletAddress,
  version,
  isGnosisSafe,
  host,
}: TOSInput) => {
  const [tos, setTos] = useState<TOSState>({
    status: TOSStatus.INIT,
  })

  useEffect(() => {
    const request = async (walletAddress: string) => {
      /**
         Initial step - fetch info about user acceptance from database.
         */
      const termsOfServiceAcceptance = await verifyTermsOfServiceAcceptance({
        walletAddress,
        version,
        host,
      })

      /**
         If acceptance exists & user is authorized & ToS was not updated, let user in.
         */
      if (
        termsOfServiceAcceptance.acceptance &&
        termsOfServiceAcceptance.authorized &&
        !termsOfServiceAcceptance.updated
      ) {
        setTos({
          status: TOSStatus.DONE,
        })
      }

      /**
         If user is not authorized or ToS was updated, launch ToS signature process.
         */
      if (!termsOfServiceAcceptance.authorized || termsOfServiceAcceptance.updated) {
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
                const newStatus = termsOfServiceAcceptance.updated
                  ? TOSStatus.WAITING_FOR_ACCEPTANCE_UPDATED
                  : TOSStatus.WAITING_FOR_ACCEPTANCE

                setTos({
                  status: newStatus,
                  /**
                   ToS api calls to save / update signature
                   */
                  action: actionErrorWrapper({
                    fn: async () => {
                      setTos({ status: TOSStatus.LOADING, previousStatus: newStatus })
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
              } else {
                throw Error('Failed to generate JWT, try again or contact with Support.')
              }
            },
            setTos,
            actionStatus: TOSStatus.WAITING_FOR_SIGNATURE,
          }),
        })
      }
    }

    if (!walletAddress) {
      return
    }

    void request(walletAddress)
  }, [walletAddress, version, chainId, isGnosisSafe, host, signMessage])

  return tos
}

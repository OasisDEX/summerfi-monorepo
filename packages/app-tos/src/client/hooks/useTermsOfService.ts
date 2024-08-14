'use client'
import { useEffect, useMemo, useState } from 'react'
import { type TOSState, TOSStatus } from '@summerfi/app-types'

import { acceptanceStep } from '@/client/helpers/acceptance-step'
import { signatureStep } from '@/client/helpers/signature-step'
import { verifyTermsOfServiceAcceptance } from '@/client/helpers/verify-terms-of-service-acceptance'
import { type TOSInput } from '@/types'

/**
 * Summer.fi Terms of Service hook
 *
 * @remarks
 * This hooks assume that there is API running on the same host (if not, `host` parameter should be defined and CORS configured)
 * with proper handling of all endpoints that are being called (`/api/tos/*`, `/api/auth/signin`).
 *
 * @param signMessage - web3 sign handler required for on-chain signature
 * @param chainId - chain id, i.e. 1 (ethereum mainnet)
 * @param walletAddress - user wallet address
 * @param version - Terms of Service version
 * @param isGnosisSafe - boolean to determine whether user use safe multi-sig
 * @param host - Optional, to be used when API is not available under the same host (for example localhost development on different ports).
 * @param forceDisconnect Optional, to be used to disconnect user when there is an issue with API to prevent him / her from using app without accepting TOS.
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
  forceDisconnect,
}: TOSInput) => {
  const [tos, setTos] = useState<TOSState>({
    status: TOSStatus.INIT,
  })

  const memoizedSignMessage = useMemo(() => signMessage, [walletAddress, chainId])

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

      if (!termsOfServiceAcceptance) {
        if (forceDisconnect) {
          // eslint-disable-next-line no-console
          console.error('Terms of Service acceptance failed. Disconnecting user.')
          forceDisconnect()
        }

        return
      }

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
       If acceptance doesn't exist & user is authorized, launch ToS acceptance process.
       */
      if (termsOfServiceAcceptance.authorized && !termsOfServiceAcceptance.acceptance) {
        acceptanceStep({ setTos, termsOfServiceAcceptance, walletAddress, version, host })
      }

      /**
         If user is not authorized or ToS was updated, launch ToS signature process.
         */
      if (!termsOfServiceAcceptance.authorized || termsOfServiceAcceptance.updated) {
        signatureStep({
          setTos,
          termsOfServiceAcceptance,
          host,
          version,
          walletAddress,
          isGnosisSafe,
          chainId,
          signMessage: memoizedSignMessage,
        })
      }
    }

    if (!walletAddress) {
      return
    }

    void request(walletAddress)
  }, [walletAddress, version, chainId, isGnosisSafe, host, memoizedSignMessage, forceDisconnect])

  return tos
}

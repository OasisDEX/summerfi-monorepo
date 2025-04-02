'use client'
import { useEffect, useState } from 'react'
import { type TOSState, TOSStatus } from '@summerfi/app-types'

import { acceptanceStep } from '@/client/helpers/acceptance-step'
import { isValidVersion } from '@/client/helpers/is-valid-version'
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
 * @param signMessage - web3 sign handler required for on-chain signature, needs to be memoized
 * @param chainId - chain id, i.e. 1 (ethereum mainnet)
 * @param walletAddress - user wallet address
 * @param version - Terms of Service version
 * @param cookiePrefix - The prefix of cookie that will be stored as http-only cookie.
 * @param host - Optional, to be used when API is not available under the same host (for example localhost development on different ports).
 * @param type - The type of Terms of Service message to generate.
 * @param forceDisconnect Optional, to be used to disconnect user when there is an issue with API to prevent him / her from using app without accepting TOS.
 * @param isSmartAccount - A boolean indicating if the wallet is a Smart Account.
 * @param publicClient - public viem client
 *
 * @returns Returns state of Terms of Service flow
 *
 */
export const useTermsOfService = ({
  signMessage,
  chainId,
  walletAddress,
  version,
  host,
  forceDisconnect,
  cookiePrefix,
  type = 'default',
  isSmartAccount,
  publicClient,
}: Omit<TOSInput, 'isGnosisSafe'>): TOSState => {
  const [tos, setTos] = useState<TOSState>({
    status: TOSStatus.INIT,
  })

  if (!isValidVersion(version)) {
    throw new Error(
      'Invalid version format. The version must be in the following format: {name}_version-DD.MM.YYYY',
    )
  }

  // this should be memoized when passed as parameter
  const memoizedSignMessage = signMessage

  useEffect(() => {
    const request = async (address: string) => {
      // smart account could be the one from account kit
      // which handles signatures well
      // condition below is for safe specific case
      const bytecodeOfPotentialContract = !isSmartAccount
        ? await publicClient
            .getBytecode({
              address: address as `0x${string}`,
            })
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.error('Failed to fetch bytecode:', error)

              return undefined
            })
        : undefined

      const isGnosisSafe = (bytecodeOfPotentialContract?.length ?? 0) > 0

      /**
         Initial step - fetch info about user acceptance from database.
         */
      const termsOfServiceAcceptance = await verifyTermsOfServiceAcceptance({
        walletAddress: address,
        version,
        cookiePrefix,
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
        acceptanceStep({
          setTos,
          termsOfServiceAcceptance,
          walletAddress: address,
          version,
          cookiePrefix,
          host,
        })
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
          walletAddress: address,
          isGnosisSafe,
          chainId,
          signMessage: memoizedSignMessage,
          cookiePrefix,
          type,
        })
      }
    }

    if (!walletAddress) {
      return
    }

    void request(walletAddress)
  }, [
    walletAddress,
    version,
    cookiePrefix,
    chainId,
    host,
    memoizedSignMessage,
    forceDisconnect,
    type,
    publicClient,
    isSmartAccount,
  ])

  return tos
}

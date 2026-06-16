'use client'
import { type SdkClient } from '@summerfi/sdk-client-react'
import { type ChainId } from '@summerfi/sdk-common'
import { useQuery } from '@tanstack/react-query'

type UseRwaUserVaultExposureProps = {
  // Only fetch when the vault is RWA, the wallet is whitelisted and connected.
  enabled: boolean
  sdk: SdkClient
  fleetAddress: string
  walletAddress?: string
  chainId: number
}

// Shared so callers can invalidate this query after a deposit/claim/cancel (which changes exposure
// and therefore whether the user is forwarded to their manage view).
export const getRwaUserVaultExposureQueryKey = (
  chainId: number,
  fleetAddress: string,
  walletAddress?: string,
) => ['rwa-user-vault-exposure', chainId, fleetAddress.toLowerCase(), walletAddress?.toLowerCase()]

/**
 * Reads the connected wallet's total RWA vault exposure (settled + pending + claimable) client-side.
 * Used on the open/deposit view to forward a receipts-only holder to their manage view, where the
 * "settling" position summary is rendered.
 */
export const useRwaUserVaultExposure = ({
  enabled,
  sdk,
  fleetAddress,
  walletAddress,
  chainId,
}: UseRwaUserVaultExposureProps) =>
  useQuery({
    queryKey: [
      'rwa-user-vault-exposure',
      chainId,
      fleetAddress.toLowerCase(),
      walletAddress?.toLowerCase(),
    ],
    queryFn: () =>
      sdk.getRwaUserVaultExposure({
        fleetAddress: fleetAddress.toLowerCase() as `0x${string}`,
        chainId: chainId as ChainId,
        userAddress: (walletAddress as string).toLowerCase() as `0x${string}`,
      }),
    enabled: enabled && !!walletAddress,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  })

import { FleetCommanderAbi } from '@summerfi/armada-protocol-abis'

import { alwaysVisibleVaults, getVaultVisibilityKey } from '@/constants/always-visible-vaults'
import { getSSRPublicClient } from '@/helpers/get-ssr-public-client'

/**
 * Map of `<chainId>-<vaultAddressLowercase>` -> on-chain `paused()` state. Only vaults present in
 * the map were checked; consumers treat missing keys as not paused.
 */
export type VaultsPausedMap = { [key: string]: boolean }

/**
 * Reads the on-chain `paused()` flag for every vault in the always-visible allowlist (the only
 * vaults that can be paused yet still displayed). Grouped into one multicall per chain; a vault
 * whose read fails is treated as not paused so a transient RPC error never blanks a card out.
 */
export const getVaultsPausedMap = async (): Promise<VaultsPausedMap> => {
  const vaultsByChain = alwaysVisibleVaults.reduce<{ [chainId: string]: `0x${string}`[] }>(
    (acc, key) => {
      const [chainId, address] = key.split('-')

      acc[chainId] = [...(acc[chainId] ?? []), address as `0x${string}`]

      return acc
    },
    {},
  )

  const pausedMap: VaultsPausedMap = {}

  await Promise.all(
    Object.entries(vaultsByChain).map(async ([chainId, addresses]) => {
      try {
        const publicClient = await getSSRPublicClient(Number(chainId))

        if (!publicClient) {
          return
        }

        const results = await publicClient.multicall({
          contracts: addresses.map((address) => ({
            abi: FleetCommanderAbi,
            address,
            functionName: 'paused' as const,
          })),
        })

        results.forEach((result, index) => {
          pausedMap[getVaultVisibilityKey(chainId, addresses[index])] =
            result.status === 'success' && result.result
        })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Error fetching paused state for chain ${chainId}:`, error)
      }
    }),
  )

  return pausedMap
}

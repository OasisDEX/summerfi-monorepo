'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  type DropdownRawOption,
  type NetworkNames,
  type SDKVaultishType,
} from '@summerfi/app-types'
import { networkNameToSDKNetwork, supportedSDKNetwork } from '@summerfi/app-utils'

import {
  dedupeVaults,
  getVaultRole,
  getVaultUniqueId,
  isEligibleDcaVault,
  isEthVault,
  isStablecoinVault,
  makeDropdownOptions,
  mapVaultToOption,
} from '@/features/dca/lib/dca-vault-helpers'
import { isPairAllowed } from '@/features/dca/lib/select-dca-vaults'
import { type DCAResolvedPair } from '@/features/dca/lib/types'

interface UseDCAVaultSelectionParams {
  sourceVaults: SDKVaultishType[]
  targetVaults: SDKVaultishType[]
  pairs: { fromVaultId: string; toVaultId: string }[]
  selectedNetwork: NetworkNames
  sourceVault: SDKVaultishType
  targetVault: SDKVaultishType
  setSourceVault: (vault: SDKVaultishType) => void
  setTargetVault: (vault: SDKVaultishType) => void
}

interface UseDCAVaultSelectionResult {
  selectedSDKNetwork: ReturnType<typeof supportedSDKNetwork>
  hasEligiblePair: boolean
  pair: DCAResolvedPair
  sourceOptions: DropdownRawOption[]
  targetOptions: DropdownRawOption[]
  selectedSource: DropdownRawOption
  selectedTarget: DropdownRawOption
  pairError: string | null
  handleVaultSelection: (side: 'source' | 'target', option: DropdownRawOption) => void
  handleSwapVaults: () => void
}

export const useDCAVaultSelection = ({
  sourceVaults,
  targetVaults,
  pairs,
  selectedNetwork,
  sourceVault,
  targetVault,
  setSourceVault,
  setTargetVault,
}: UseDCAVaultSelectionParams): UseDCAVaultSelectionResult => {
  const [pairError, setPairError] = useState<string | null>(null)

  const selectedSDKNetwork = useMemo(
    () => supportedSDKNetwork(networkNameToSDKNetwork(selectedNetwork)),
    [selectedNetwork],
  )

  const networkVaults = useMemo(() => {
    return dedupeVaults([...sourceVaults, ...targetVaults])
      .filter((vault) => supportedSDKNetwork(vault.protocol.network) === selectedSDKNetwork)
      .filter(isEligibleDcaVault)
      .sort((a, b) => {
        const av = Number(a.totalValueLockedUSD)
        const bv = Number(b.totalValueLockedUSD)

        return bv - av
      })
  }, [selectedSDKNetwork, sourceVaults, targetVaults])

  const stablecoinVaults = useMemo(() => networkVaults.filter(isStablecoinVault), [networkVaults])
  const ethVaults = useMemo(() => networkVaults.filter(isEthVault), [networkVaults])
  const hasEligiblePair = stablecoinVaults.length > 0 && ethVaults.length > 0

  const pair = useMemo<DCAResolvedPair>(
    () => ({ fromVault: sourceVault, toVault: targetVault }),
    [sourceVault, targetVault],
  )
  const sourceOptions = useMemo(() => makeDropdownOptions(networkVaults), [networkVaults])
  const targetOptions = useMemo(() => makeDropdownOptions(networkVaults), [networkVaults])
  const selectedSource = useMemo<DropdownRawOption>(
    () => mapVaultToOption(sourceVault),
    [sourceVault],
  )
  const selectedTarget = useMemo<DropdownRawOption>(
    () => mapVaultToOption(targetVault),
    [targetVault],
  )

  useEffect(() => {
    if (!hasEligiblePair) return

    const sourceIsOnSelectedNetwork =
      supportedSDKNetwork(sourceVault.protocol.network) === selectedSDKNetwork
    const targetIsOnSelectedNetwork =
      supportedSDKNetwork(targetVault.protocol.network) === selectedSDKNetwork

    if (sourceIsOnSelectedNetwork && targetIsOnSelectedNetwork) return

    setPairError(null)
    setSourceVault(stablecoinVaults[0])
    setTargetVault(ethVaults[0])
  }, [
    ethVaults,
    hasEligiblePair,
    selectedSDKNetwork,
    setSourceVault,
    setTargetVault,
    stablecoinVaults,
    sourceVault.protocol.network,
    targetVault.protocol.network,
  ])

  const handlePairChange = useCallback(
    (next: DCAResolvedPair) => {
      if (!isPairAllowed(pairs, next.fromVault.id, next.toVault.id)) {
        setPairError('This source / target combination is not enabled by the keeper allow-list.')

        return
      }

      setPairError(null)
      setSourceVault(next.fromVault)
      setTargetVault(next.toVault)
    },
    [pairs, setSourceVault, setTargetVault],
  )

  const resolveOppositeVault = useCallback(
    (
      selectedVault: SDKVaultishType,
      currentOppositeVault: SDKVaultishType,
    ): SDKVaultishType | undefined => {
      const desiredRole = getVaultRole(selectedVault) === 'eth' ? 'stable' : 'eth'

      if (
        supportedSDKNetwork(currentOppositeVault.protocol.network) === selectedSDKNetwork &&
        getVaultRole(currentOppositeVault) === desiredRole
      ) {
        return currentOppositeVault
      }

      return desiredRole === 'stable' ? stablecoinVaults[0] : ethVaults[0]
    },
    [ethVaults, selectedSDKNetwork, stablecoinVaults],
  )

  const handleVaultSelection = useCallback(
    (side: 'source' | 'target', option: DropdownRawOption): void => {
      const nextVault = networkVaults.find((vault) => getVaultUniqueId(vault) === option.value)

      if (!nextVault) return

      const nextCounterpart =
        side === 'source'
          ? resolveOppositeVault(nextVault, targetVault)
          : resolveOppositeVault(nextVault, sourceVault)

      if (!nextCounterpart) {
        setPairError('This network needs both stablecoin and ETH vaults before DCA can be created.')

        return
      }

      const nextPair =
        side === 'source'
          ? {
              fromVault: nextVault,
              toVault: nextCounterpart,
            }
          : {
              fromVault: nextCounterpart,
              toVault: nextVault,
            }

      handlePairChange(nextPair)
    },
    [handlePairChange, networkVaults, resolveOppositeVault, sourceVault, targetVault],
  )

  const handleSwapVaults = useCallback((): void => {
    handlePairChange({ fromVault: targetVault, toVault: sourceVault })
  }, [handlePairChange, sourceVault, targetVault])

  return {
    selectedSDKNetwork,
    hasEligiblePair,
    pair,
    sourceOptions,
    targetOptions,
    selectedSource,
    selectedTarget,
    pairError,
    handleVaultSelection,
    handleSwapVaults,
  }
}

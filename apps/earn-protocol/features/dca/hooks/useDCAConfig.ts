'use client'

import { useCallback, useState } from 'react'
import { NetworkNames, type SDKVaultishType } from '@summerfi/app-types'

import { type DCAConfig, type DCAResolvedPair } from '@/features/dca/lib/types'

const DEFAULT_CONFIG: DCAConfig = {
  selectedNetwork: NetworkNames.ethereumMainnet,
  amount: 250,
  frequency: 1,
  neverBuyAbove: undefined,
  neverSellBelow: undefined,
  maxTrades: undefined,
  deadline: undefined,
}

interface UseDCAConfigArgs {
  defaultSourceVault: SDKVaultishType
  defaultTargetVault: SDKVaultishType
  initialConfig?: Partial<DCAConfig>
  initialPair?: DCAResolvedPair
}

interface UseDCAConfigReturn {
  config: DCAConfig
  sourceVault: SDKVaultishType
  targetVault: SDKVaultishType
  setConfig: (next: DCAConfig) => void
  patchConfig: (patch: Partial<DCAConfig>) => void
  setSourceVault: (vault: SDKVaultishType) => void
  setTargetVault: (vault: SDKVaultishType) => void
  reset: () => void
}

/**
 * Local state machine that drives the DCA wizard.
 */
export const useDCAConfig = ({
  defaultSourceVault,
  defaultTargetVault,
  initialConfig,
  initialPair,
}: UseDCAConfigArgs): UseDCAConfigReturn => {
  const [config, setConfig] = useState<DCAConfig>({ ...DEFAULT_CONFIG, ...initialConfig })
  const [sourceVault, setSourceVault] = useState<SDKVaultishType>(
    initialPair?.fromVault ?? defaultSourceVault,
  )
  const [targetVault, setTargetVault] = useState<SDKVaultishType>(
    initialPair?.toVault ?? defaultTargetVault,
  )

  const patchConfig = useCallback((patch: Partial<DCAConfig>) => {
    setConfig((current) => ({ ...current, ...patch }))
  }, [])

  const reset = useCallback(() => {
    setConfig({ ...DEFAULT_CONFIG, ...initialConfig })
    setSourceVault(initialPair?.fromVault ?? defaultSourceVault)
    setTargetVault(initialPair?.toVault ?? defaultTargetVault)
  }, [defaultSourceVault, defaultTargetVault, initialConfig, initialPair])

  return {
    config,
    sourceVault,
    targetVault,
    setConfig,
    patchConfig,
    setSourceVault,
    setTargetVault,
    reset,
  }
}

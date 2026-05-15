'use client'

import { useCallback, useState } from 'react'
import { NetworkNames, type SDKVaultishType } from '@summerfi/app-types'

import { type DCAConfig } from '@/features/dca/lib/types'

const DEFAULT_CONFIG: DCAConfig = {
  selectedNetwork: NetworkNames.ethereumMainnet,
  amount: 250,
  frequency: 1,
  budget: 0,
  priceCeiling: 0,
  stopAtTarget: 0,
}

interface UseDCAConfigArgs {
  defaultSourceVault: SDKVaultishType
  defaultTargetVault: SDKVaultishType
  initialConfig?: Partial<DCAConfig>
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
}: UseDCAConfigArgs): UseDCAConfigReturn => {
  const [config, setConfig] = useState<DCAConfig>({ ...DEFAULT_CONFIG, ...initialConfig })
  const [sourceVault, setSourceVault] = useState<SDKVaultishType>(defaultSourceVault)
  const [targetVault, setTargetVault] = useState<SDKVaultishType>(defaultTargetVault)

  const patchConfig = useCallback((patch: Partial<DCAConfig>) => {
    setConfig((current) => ({ ...current, ...patch }))
  }, [])

  const reset = useCallback(() => {
    setConfig({ ...DEFAULT_CONFIG, ...initialConfig })
    setSourceVault(defaultSourceVault)
    setTargetVault(defaultTargetVault)
  }, [defaultSourceVault, defaultTargetVault, initialConfig])

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

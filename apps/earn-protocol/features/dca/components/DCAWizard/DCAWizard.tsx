'use client'

import { type FC, useMemo } from 'react'
import { Button, Card, getDisplayToken, Text } from '@summerfi/app-earn-ui'
import { type SDKVaultsListType } from '@summerfi/app-types'
import { supportedSDKNetwork } from '@summerfi/app-utils'

import { DCASidebar } from '@/features/dca/components/DCASidebar/DCASidebar'
import { StepAdvancedConfig } from '@/features/dca/components/DCAWizard/StepAdvancedConfig'
import { StepAmountFrequency } from '@/features/dca/components/DCAWizard/StepAmountFrequency'
import { StepNetworkSelector } from '@/features/dca/components/DCAWizard/StepNetworkSelector'
import { StepVaultSelector } from '@/features/dca/components/DCAWizard/StepVaultSelector'
import { useDCAConfig } from '@/features/dca/hooks/useDCAConfig'
import { useDCAVaultSelection } from '@/features/dca/hooks/useDCAVaultSelection'
import { usePeriodSummaries } from '@/features/dca/hooks/usePeriodSummaries'
import {
  dedupeVaults,
  isEligibleDcaVault,
  isEthVault,
  isStablecoinVault,
} from '@/features/dca/lib/dca-vault-helpers'
import {
  DEFAULT_SDK_NETWORK,
  FREQUENCY_OPTIONS,
  type FrequencyOptionId,
  MAX_FREQUENCY_DAYS,
} from '@/features/dca/lib/dca-wizard-constants'
import { type DCAConfig, type DCAResolvedPair } from '@/features/dca/lib/types'

import classNames from '@/features/dca/components/dca.module.css'

interface DCAWizardProps {
  sourceVaults: SDKVaultsListType
  targetVaults: SDKVaultsListType
  pairs: { fromVaultId: string; toVaultId: string }[]
  onSubmit: (config: DCAConfig, pair: DCAResolvedPair) => void
  config?: DCAConfig
  pair?: DCAResolvedPair
}

interface DCAWizardInnerProps extends DCAWizardProps {
  defaultSourceVault: SDKVaultsListType[number]
  defaultTargetVault: SDKVaultsListType[number]
}

const DCAWizardInner: FC<DCAWizardInnerProps> = ({
  sourceVaults,
  targetVaults,
  pairs,
  defaultSourceVault,
  defaultTargetVault,
  config: initialConfig,
  pair: initialPair,
  onSubmit,
}) => {
  const { config, sourceVault, targetVault, setSourceVault, setTargetVault, patchConfig } =
    useDCAConfig({ defaultSourceVault, defaultTargetVault, initialConfig, initialPair })

  const {
    hasEligiblePair,
    pair,
    sourceOptions,
    targetOptions,
    selectedSource,
    selectedTarget,
    pairError,
    handleVaultSelection,
    handleSwapVaults,
  } = useDCAVaultSelection({
    sourceVaults,
    targetVaults,
    pairs,
    selectedNetwork: config.selectedNetwork,
    sourceVault,
    targetVault,
    setSourceVault,
    setTargetVault,
  })

  const sourceSymbol = getDisplayToken(pair.fromVault.inputToken.symbol)
  const targetSymbol = getDisplayToken(pair.toVault.inputToken.symbol)
  const sourceTokenPrice = Number(pair.fromVault.inputTokenPriceUSD ?? 0)
  const targetTokenPrice = Number(pair.toVault.inputTokenPriceUSD ?? 0)
  const isSourceEthVault = isEthVault(pair.fromVault)
  const isTargetEthVault = isEthVault(pair.toVault)
  const ethPrice = isTargetEthVault ? targetTokenPrice : isSourceEthVault ? sourceTokenPrice : 0
  const sourceToTargetRate =
    sourceTokenPrice > 0 && targetTokenPrice > 0 ? sourceTokenPrice / targetTokenPrice : null
  const estimatedTargetAmount =
    sourceToTargetRate && config.amount > 0 ? config.amount * sourceToTargetRate : null
  const frequencyDays = Number.isFinite(config.frequency)
    ? Math.max(1, Math.round(config.frequency))
    : 1

  const { periodSummaries, canPreviewPrevious, canPreviewNext, previewPrevious, previewNext } =
    usePeriodSummaries({
      frequencyDays,
      amount: config.amount,
      estimatedTargetAmount,
      maxTrades: config.maxTrades,
      deadline: config.deadline,
    })

  const selectedFrequencyOption: FrequencyOptionId =
    FREQUENCY_OPTIONS.find((option) => option.days === frequencyDays)?.id ?? 'custom'

  const thresholdError =
    isTargetEthVault &&
    config.neverBuyAbove !== undefined &&
    ethPrice > 0 &&
    config.neverBuyAbove < ethPrice
      ? `Never buy above must be at least current ETH price ($${ethPrice.toLocaleString()}).`
      : isSourceEthVault &&
          config.neverSellBelow !== undefined &&
          ethPrice > 0 &&
          config.neverSellBelow > ethPrice
        ? `Never sell below must be at most current ETH price ($${ethPrice.toLocaleString()}).`
        : null

  const handleSwapVaultsWithAmount = () => {
    const nextAmount = config.amount

    if (estimatedTargetAmount && estimatedTargetAmount > 0) {
      patchConfig({ amount: estimatedTargetAmount })
      handleSwapVaults()

      return
    }

    patchConfig({ amount: nextAmount })
    handleSwapVaults()
  }

  return (
    <div className={classNames.layout}>
      <div className={classNames.wizardColumn}>
        <Text as="h3" variant="h4">
          Create DCA Strategy
        </Text>
        <StepNetworkSelector
          selectedNetwork={config.selectedNetwork}
          onSelectNetwork={(selectedNetwork) => patchConfig({ selectedNetwork })}
        />
        <StepVaultSelector
          hasEligiblePair={hasEligiblePair}
          sourceVault={sourceVault}
          targetVault={targetVault}
          sourceOptions={sourceOptions}
          targetOptions={targetOptions}
          selectedSource={selectedSource}
          selectedTarget={selectedTarget}
          pairError={pairError}
          onSelectVault={handleVaultSelection}
          onSwapVaults={handleSwapVaultsWithAmount}
        />
        <StepAmountFrequency
          amount={config.amount}
          frequencyDays={frequencyDays}
          selectedFrequencyOption={selectedFrequencyOption}
          sourceTokenDecimals={pair.fromVault.inputToken.decimals}
          sourceSymbol={sourceSymbol}
          targetSymbol={targetSymbol}
          estimatedTargetAmount={estimatedTargetAmount}
          sourceToTargetRate={sourceToTargetRate}
          periodSummaries={periodSummaries}
          canPreviewPrevious={canPreviewPrevious}
          canPreviewNext={canPreviewNext}
          onPreviewPrevious={previewPrevious}
          onPreviewNext={previewNext}
          onAmountChange={(amount) => patchConfig({ amount })}
          onFrequencyChange={(frequency) =>
            patchConfig({ frequency: Math.max(1, Math.min(MAX_FREQUENCY_DAYS, frequency)) })
          }
        />
        <StepAdvancedConfig
          config={config}
          sourceSymbol={sourceSymbol}
          targetSymbol={targetSymbol}
          isSourceEthVault={isSourceEthVault}
          isTargetEthVault={isTargetEthVault}
          patchConfig={patchConfig}
          ethPrice={ethPrice}
          thresholdError={thresholdError}
        />
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            gap: 'var(--general-space-12)',
          }}
        >
          <Button variant="secondaryLarge" disabled>
            Back
          </Button>
          <Button
            variant="primaryLarge"
            onClick={() => onSubmit(config, pair)}
            disabled={!hasEligiblePair || !!pairError || !!thresholdError}
          >
            Preview DCA Strategy
          </Button>
        </div>
      </div>
      <div className={classNames.sidebarColumn}>
        <Text as="h3" variant="h4">
          &nbsp;
        </Text>
        <DCASidebar />
      </div>
    </div>
  )
}

export const DCAWizard: FC<DCAWizardProps> = ({
  sourceVaults,
  targetVaults,
  pairs,
  onSubmit,
  config,
  pair,
}) => {
  const { defaultSourceVault, defaultTargetVault } = useMemo(() => {
    const vaultsForDefaultNetwork = dedupeVaults([...sourceVaults, ...targetVaults]).filter(
      (vault) =>
        supportedSDKNetwork(vault.protocol.network) === DEFAULT_SDK_NETWORK &&
        isEligibleDcaVault(vault),
    )

    return {
      defaultSourceVault: vaultsForDefaultNetwork.find(isStablecoinVault) ?? sourceVaults[0],
      defaultTargetVault: vaultsForDefaultNetwork.find(isEthVault) ?? targetVaults[0],
    }
  }, [sourceVaults, targetVaults])

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!defaultSourceVault || !defaultTargetVault) {
    return (
      <Card variant="cardSecondary">
        <div className={classNames.emptyStateContent}>
          <Text as="h4" variant="h5">
            DCA isn&apos;t available yet
          </Text>
          <Text as="p" variant="p3" className={classNames.mutedText}>
            We couldn&apos;t find an eligible source / target vault pair on this network. Please
            check back once additional vaults are deployed.
          </Text>
        </div>
      </Card>
    )
  }

  return (
    <DCAWizardInner
      sourceVaults={sourceVaults}
      targetVaults={targetVaults}
      pairs={pairs}
      defaultSourceVault={defaultSourceVault}
      defaultTargetVault={defaultTargetVault}
      config={config}
      pair={pair}
      onSubmit={onSubmit}
    />
  )
}

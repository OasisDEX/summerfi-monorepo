'use client'

import { type FC, useCallback, useMemo, useState } from 'react'
import {
  Button,
  getDisplayToken,
  getEarnProtocolChainById,
  Icon,
  Text,
  TextNumberAnimated,
  Tooltip,
  useEarnProtocolChain,
  useEarnProtocolLogin,
  useEarnProtocolWallet,
} from '@summerfi/app-earn-ui'
import { type TokenSymbolsList } from '@summerfi/app-types'
import { subgraphNetworkToSDKId, supportedSDKNetwork } from '@summerfi/app-utils'
import {
  Address,
  type AddressValue,
  getChainInfoByChainId,
  Token,
  TokenAmount,
} from '@summerfi/sdk-common'
import { useRouter } from 'next/navigation'

import { VaultSwitchBox } from '@/components/molecules/SidebarElements/VaultSwitchBox'
import { DCASidebar } from '@/features/dca/components/DCASidebar/DCASidebar'
import { DCAWizardStepCard } from '@/features/dca/components/DCAWizard/DCAWizardStepCard'
import { type DCAConfig, type DCAResolvedPair } from '@/features/dca/lib/types'
import { useAppSDK } from '@/hooks/use-app-sdk'

import classNames from '@/features/dca/components/dca.module.css'

interface DCAApprovalFlowProps {
  config: DCAConfig
  pair: DCAResolvedPair
  onBack: () => void
}

export const DCAApprovalFlow: FC<DCAApprovalFlowProps> = ({ config, pair, onBack }) => {
  const { login } = useEarnProtocolLogin()
  const { walletClient, address } = useEarnProtocolWallet()
  const { chain, setChain, isSettingChain } = useEarnProtocolChain()
  const { createAndSaveBuyOrder } = useAppSDK()
  const { push } = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const chainId = useMemo(
    () => subgraphNetworkToSDKId(supportedSDKNetwork(pair.fromVault.protocol.network)),
    [pair.fromVault.protocol.network],
  )

  const isProperChainSelected = chain.id === chainId
  const targetChain = getEarnProtocolChainById(chainId)

  const sourceSymbol = getDisplayToken(pair.fromVault.inputToken.symbol)
  const targetSymbol = getDisplayToken(pair.toVault.inputToken.symbol)
  const frequencyDays = Number.isFinite(config.frequency)
    ? Math.max(1, Math.round(config.frequency))
    : 1

  const isTargetEthVault = targetSymbol === 'ETH'
  const isSourceEthVault = sourceSymbol === 'ETH'
  const thresholdLabel = isTargetEthVault
    ? 'Never buy above'
    : isSourceEthVault
      ? 'Never sell below'
      : null
  const thresholdValue =
    isTargetEthVault && config.neverBuyAbove ? (
      <>
        {config.neverBuyAbove.toFixed(4)}{' '}
        <Text as="span" variant="p4semi" style={{ color: 'var(--color-text-secondary)' }}>
          {targetSymbol}/{sourceSymbol}
        </Text>
      </>
    ) : isSourceEthVault && config.neverSellBelow ? (
      <>
        {config.neverSellBelow.toFixed(4)}{' '}
        <Text as="span" variant="p4semi" style={{ color: 'var(--color-text-secondary)' }}>
          {sourceSymbol}/{targetSymbol}
        </Text>
      </>
    ) : (
      'Not set'
    )
  const thresholdDescription = isTargetEthVault
    ? `Skip executions when ${targetSymbol} trades above this price.`
    : isSourceEthVault
      ? `Skip executions when ${sourceSymbol} trades below this price.`
      : null

  const handleCreateDca = useCallback(async () => {
    if (!address || !walletClient) {
      setErrorMessage('Connect your wallet before creating a DCA strategy.')

      return
    }

    setIsCreating(true)
    setErrorMessage(null)

    const nowUnix = Math.floor(Date.now() / 1000)
    const intervalSeconds = Math.max(1, Math.round(config.frequency * 24 * 60 * 60))
    const firstExecutionUnixTimestamp = nowUnix + intervalSeconds
    const parsedDeadline = config.deadline
      ? Math.floor(new Date(config.deadline).getTime() / 1000)
      : undefined
    const deadlineUnixTimestamp =
      parsedDeadline && Number.isFinite(parsedDeadline) ? parsedDeadline : undefined

    try {
      const sourceToken = Token.createFrom({
        chainInfo: getChainInfoByChainId(chainId),
        address: Address.createFromEthereum({
          value: pair.fromVault.inputToken.id as AddressValue,
        }),
        name: pair.fromVault.inputToken.name,
        symbol: pair.fromVault.inputToken.symbol,
        decimals: pair.fromVault.inputToken.decimals,
      })

      const tokenAmount = TokenAmount.createFrom({
        token: sourceToken,
        amount: config.amount.toString(),
      })

      const dcaPositionData = await createAndSaveBuyOrder({
        userAddress: address as `0x${string}`,
        chainId,
        toVaultAddress: pair.toVault.id as AddressValue,
        fromVaultAddress: pair.fromVault.id as AddressValue,
        signTypedData: walletClient.signTypedData,
        amount: tokenAmount,
        slippagePercentage: '0.5',
        intervalSeconds,
        firstExecutionUnixTimestamp,
        deadlineUnixTimestamp,
        maxTrades: config.maxTrades ?? 1000,
        neverBuyAbove: config.neverBuyAbove?.toString(),
        neverSellBelow: config.neverSellBelow?.toString(),
      })

      push(`/dca/position/${dcaPositionData.id}`)
    } catch (error) {
      const isRejected = error instanceof Error && /rejected|denied/iu.test(error.message)

      if (!isRejected) {
        // eslint-disable-next-line no-console
        console.error('Failed to create DCA strategy:', error)
      }

      setErrorMessage(
        isRejected
          ? 'Signature rejected. Please confirm in your wallet to continue.'
          : 'Failed to create DCA strategy.',
      )
    } finally {
      setIsCreating(false)
    }
  }, [
    chainId,
    config.amount,
    config.deadline,
    config.frequency,
    config.maxTrades,
    config.neverBuyAbove,
    config.neverSellBelow,
    createAndSaveBuyOrder,
    pair.fromVault,
    pair.toVault,
    walletClient,
    address,
    push,
  ])

  const primaryButton = useMemo(() => {
    if (!address) {
      return { label: 'Connect Wallet', action: login, disabled: false }
    }
    if (!isProperChainSelected) {
      return {
        label: `Switch network to ${targetChain.name}`,
        action: () => setChain({ chain: targetChain }),
        disabled: isSettingChain,
      }
    }

    return {
      label: isCreating ? 'Creating…' : 'Create DCA',
      action: handleCreateDca,
      disabled: isCreating,
    }
  }, [
    address,
    handleCreateDca,
    isCreating,
    isProperChainSelected,
    isSettingChain,
    login,
    setChain,
    targetChain,
  ])

  return (
    <div className={classNames.layout}>
      <div className={classNames.wizardColumn}>
        <Text as="h3" variant="h4">
          Review your DCA strategy
        </Text>

        <DCAWizardStepCard title="Your selected vaults">
          <div className={classNames.vaultSelectorRow}>
            <div
              className={`${classNames.vaultSelectorContent} ${classNames.vaultSelectorContentSource}`}
            >
              <div className={classNames.vaultSelectorCard}>
                <VaultSwitchBox
                  title="From"
                  chainId={chainId}
                  tokenName={pair.fromVault.inputToken.symbol as TokenSymbolsList}
                  risk={
                    pair.fromVault.isDaoManaged
                      ? 'higher'
                      : (pair.fromVault.customFields?.risk ?? 'lower')
                  }
                  wrapperStyle={{ background: 'transparent', width: '100%' }}
                  isDaoManaged={pair.fromVault.isDaoManaged}
                />
              </div>
            </div>

            <button
              type="button"
              className={classNames.vaultSelectorBridge}
              style={{
                pointerEvents: 'none',
                cursor: 'default',
              }}
              aria-label="Vault pair"
              title="Vault pair"
              tabIndex={-1}
            >
              <Icon iconName="arrow_forward" size={20} />
            </button>

            <div className={classNames.vaultSelectorContent}>
              <div className={classNames.vaultSelectorCard}>
                <VaultSwitchBox
                  title="To"
                  chainId={chainId}
                  tokenName={pair.toVault.inputToken.symbol as TokenSymbolsList}
                  risk={
                    pair.toVault.isDaoManaged
                      ? 'higher'
                      : (pair.toVault.customFields?.risk ?? 'lower')
                  }
                  wrapperStyle={{ background: 'transparent', width: '100%' }}
                  isDaoManaged={pair.toVault.isDaoManaged}
                />
              </div>
            </div>
          </div>
        </DCAWizardStepCard>

        <DCAWizardStepCard title="Amount and frequency">
          <div className={classNames.step3Row}>
            <div className={classNames.step3InputsColumn}>
              <div className={classNames.pricePreviewBlock}>
                <Text as="p" variant="p3" className={classNames.mutedText}>
                  Amount per run
                </Text>
                <Text as="span" variant="h5" className={classNames.pricePreviewAmount}>
                  <TextNumberAnimated value={config.amount} variant="h5" /> {sourceSymbol}
                </Text>
              </div>
            </div>
            <div className={classNames.step3InputsColumn}>
              <div className={classNames.pricePreviewBlock}>
                <Text as="p" variant="p3" className={classNames.mutedText}>
                  Frequency
                </Text>
                <Text as="span" variant="h5" className={classNames.pricePreviewAmount}>
                  Every {frequencyDays} {frequencyDays === 1 ? 'day' : 'days'}
                </Text>
              </div>
            </div>
          </div>
        </DCAWizardStepCard>

        <DCAWizardStepCard title="Step 4 - Advanced configuration">
          <div className={classNames.conditionsStack}>
            {thresholdLabel && thresholdDescription ? (
              <div className={classNames.conditionCardContent}>
                <div className={classNames.conditionHeader}>
                  <div>
                    <Text as="h4" variant="p2semi">
                      {thresholdLabel}
                    </Text>
                  </div>
                </div>
                <Tooltip
                  tooltipWrapperStyles={{ minWidth: '230px' }}
                  tooltip={
                    <div>
                      The strategy will skip any execution where the price of {targetSymbol} would
                      be {isTargetEthVault ? 'above' : 'below'}{' '}
                      {isTargetEthVault
                        ? config.neverBuyAbove?.toFixed(4)
                        : config.neverSellBelow?.toFixed(4)}
                      .
                    </div>
                  }
                >
                  <Text as="span" variant="h5" className={classNames.pricePreviewAmount}>
                    {thresholdValue}
                  </Text>
                </Tooltip>
                <Text as="p" variant="p4" className={classNames.mutedText}>
                  {thresholdDescription}
                </Text>
              </div>
            ) : null}

            <div className={classNames.conditionCardContent}>
              <div className={classNames.conditionHeader}>
                <div>
                  <Text as="h4" variant="p2semi">
                    Maximum Number of Trades
                  </Text>
                </div>
              </div>
              <Text as="span" variant="h5" className={classNames.pricePreviewAmount}>
                {config.maxTrades === 1000 ? '1000 (maximum)' : (config.maxTrades ?? 'Not set')}
              </Text>
              <Text as="p" variant="p4" className={classNames.mutedText}>
                Stop the strategy after this many successful trades.
              </Text>
            </div>

            <div className={classNames.conditionCardContent}>
              <div className={classNames.conditionHeader}>
                <div>
                  <Text as="h4" variant="p2semi">
                    Only trade until
                  </Text>
                </div>
              </div>
              <Text as="span" variant="h5" className={classNames.pricePreviewAmount}>
                {config.deadline
                  ? new Date(config.deadline).toLocaleDateString('en-GB')
                  : 'Not set'}
              </Text>
              <Text as="p" variant="p4" className={classNames.mutedText}>
                Stop the strategy once this date is reached.
              </Text>
            </div>
          </div>

          {errorMessage ? (
            <Text as="p" variant="p3" style={{ color: 'var(--earn-protocol-critical-100)' }}>
              {errorMessage}
            </Text>
          ) : null}
        </DCAWizardStepCard>
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            gap: 'var(--general-space-12)',
          }}
        >
          <Button variant="secondaryLarge" onClick={onBack} disabled={isCreating}>
            Back
          </Button>
          <Button
            variant="primaryLarge"
            onClick={primaryButton.action}
            disabled={primaryButton.disabled}
          >
            {primaryButton.label}
          </Button>
        </div>
      </div>

      <div className={classNames.sidebarColumn} style={{ position: 'sticky', top: 0 }}>
        <Text as="h3" variant="h4">
          &nbsp;
        </Text>
        <DCASidebar />
      </div>
    </div>
  )
}

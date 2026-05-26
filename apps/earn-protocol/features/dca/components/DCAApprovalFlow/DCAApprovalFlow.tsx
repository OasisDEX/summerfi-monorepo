'use client'

import { type FC, useCallback, useMemo, useState } from 'react'
import {
  Button,
  getDisplayToken,
  getEarnProtocolChainById,
  Icon,
  SkeletonLine,
  Text,
  TextNumberAnimated,
  Tooltip,
  useEarnProtocolChain,
  useEarnProtocolLogin,
  useEarnProtocolWallet,
  useIsIframe,
} from '@summerfi/app-earn-ui'
import { useTermsOfService } from '@summerfi/app-tos'
import { type TokenSymbolsList, TOSStatus } from '@summerfi/app-types'
import {
  formatCryptoBalance,
  sdkChainIdToHumanNetwork,
  subgraphNetworkToSDKId,
  supportedSDKNetwork,
} from '@summerfi/app-utils'
import { type AddressValue } from '@summerfi/sdk-common'
import { useRouter } from 'next/navigation'

import { PendingTransactionsList } from '@/components/molecules/PendingTransactionsList/PendingTransactionsList'
import { VaultSwitchBox } from '@/components/molecules/SidebarElements/VaultSwitchBox'
import { TermsOfServiceCookiePrefix, TermsOfServiceVersion } from '@/constants/terms-of-service'
import { DCASidebar } from '@/features/dca/components/DCASidebar/DCASidebar'
import { DCAWizardStepCard } from '@/features/dca/components/DCAWizard/DCAWizardStepCard'
import { MAX_TRADES } from '@/features/dca/lib/dca-wizard-constants'
import { type DCAConfig, type DCAResolvedPair } from '@/features/dca/lib/types'
import { useAppSDK } from '@/hooks/use-app-sdk'
import { useNetworkAlignedClient } from '@/hooks/use-network-aligned-client'
import { usePosition } from '@/hooks/use-position'
import { useTermsOfServiceSidebar } from '@/hooks/use-terms-of-service-sidebar'
import { useTermsOfServiceSigner } from '@/hooks/use-terms-of-service-signer'

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
  const { createStrategyTx } = useAppSDK()
  const dcaChainId = subgraphNetworkToSDKId(supportedSDKNetwork(pair.fromVault.protocol.network))
  const { publicClient } = useNetworkAlignedClient({
    chainId: dcaChainId,
    overrideNetwork: sdkChainIdToHumanNetwork(dcaChainId),
  })
  const { push } = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { isLoading, position } = usePosition({
    vaultId: pair.fromVault.id,
    chainId: dcaChainId,
  })
  const signTosMessage = useTermsOfServiceSigner()
  const isIframe = useIsIframe()

  const tosState = useTermsOfService({
    publicClient,
    signMessage: signTosMessage,
    chainId: dcaChainId,
    walletAddress: address,
    version: TermsOfServiceVersion.APP_VERSION,
    cookiePrefix: TermsOfServiceCookiePrefix.APP_TOKEN,
    host: '/earn',
    type: 'default',
    isIframe,
  })

  const { tosSidebarProps } = useTermsOfServiceSidebar({ tosState, handleGoBack: onBack })

  const isProperChainSelected = chain.id === dcaChainId
  const targetChain = getEarnProtocolChainById(dcaChainId)

  const sourceSymbol = getDisplayToken(pair.fromVault.inputToken.symbol)
  const targetSymbol = getDisplayToken(pair.toVault.inputToken.symbol)
  const frequencyDays = Number.isFinite(config.frequency)
    ? Math.max(1, Math.round(config.frequency))
    : 1

  const fullPermitAmount = config.amount * config.maxTrades

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

    const intervalSeconds = Math.max(1, Math.round(config.frequency * 24 * 60 * 60))
    const parsedDeadline = config.deadline
      ? Math.floor(new Date(config.deadline).getTime() / 1000)
      : undefined
    const oneYearInSeconds = 365 * 24 * 60 * 60
    // default deadline to one year from now if not set or invalid, to prevent transactions from failing with a past deadline
    const deadlineUnixTimestamp =
      parsedDeadline && Number.isFinite(parsedDeadline)
        ? parsedDeadline
        : Math.floor(Date.now() / 1000) + oneYearInSeconds

    try {
      const [txInfo] = await createStrategyTx({
        userAddress: address as AddressValue,
        chainId: dcaChainId,
        fromVault: pair.fromVault.id as AddressValue,
        toVault: pair.toVault.id as AddressValue,
        inAsset: pair.fromVault.inputToken.id as AddressValue,
        outAsset: pair.toVault.inputToken.id as AddressValue,
        // TODO: replace with real oracle feed addresses
        inAssetFeed: '0x0000000000000000000000000000000000000000' as AddressValue,
        outAssetFeed: '0x0000000000000000000000000000000000000000' as AddressValue,
        amountShares: config.amount.toString(),
        slippagePercentage: '0.5',
        intervalSeconds,
        deadlineUnixTimestamp,
        maxTrades: config.maxTrades,
        neverBuyAbove: config.neverBuyAbove?.toString(),
        neverSellBelow: config.neverSellBelow?.toString(),
      })

      await walletClient.sendTransaction({
        account: walletClient.account ?? (address as `0x${string}`),
        to: txInfo.transaction.target.value as `0x${string}`,
        data: txInfo.transaction.calldata as `0x${string}`,
        chain: null,
      })

      push(`/dca`)
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
    dcaChainId,
    config.amount,
    config.deadline,
    config.frequency,
    config.maxTrades,
    config.neverBuyAbove,
    config.neverSellBelow,
    createStrategyTx,
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
    if (tosState.status !== TOSStatus.DONE) {
      return {
        label: tosSidebarProps.primaryButton.label,
        action: tosSidebarProps.primaryButton.action,
        disabled: tosSidebarProps.primaryButton.disabled,
      }
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
    tosSidebarProps.primaryButton.action,
    tosSidebarProps.primaryButton.disabled,
    tosSidebarProps.primaryButton.label,
    tosState.status,
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
                  chainId={dcaChainId}
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
                  chainId={dcaChainId}
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

          <div className={classNames.positionInfoBar}>
            {isLoading || (position && Number(position.assetsUSD.amount) > 0.001) ? (
              <>
                <div className={classNames.amountInputsColumn}>
                  <div className={classNames.pricePreviewBlock}>
                    <Text as="p" variant="p3" className={classNames.mutedText}>
                      Source vault balance
                    </Text>
                    <Text
                      as="span"
                      variant="h5"
                      className={classNames.pricePreviewAmount}
                      style={{ margin: '0' }}
                    >
                      {isLoading ? (
                        <SkeletonLine width="80px" height={18} style={{ margin: '7px 0' }} />
                      ) : position ? (
                        `${formatCryptoBalance(Number(position.assets.amount))} ${sourceSymbol}`
                      ) : null}
                    </Text>
                    <Text as="p" variant="p4" className={classNames.mutedText}>
                      Current amount held in the source vault.
                    </Text>
                  </div>
                </div>
                <div className={classNames.amountInputsColumn}>
                  <div className={classNames.pricePreviewBlock}>
                    <Text as="p" variant="p3" className={classNames.mutedText}>
                      Possible executions
                    </Text>
                    <Text
                      as="span"
                      variant="h5"
                      className={classNames.pricePreviewAmount}
                      style={
                        position
                          ? {
                              color:
                                config.amount > 0 &&
                                Math.floor(Number(position.assets.amount) / config.amount) >= 1
                                  ? 'var(--earn-protocol-success-100)'
                                  : 'var(--earn-protocol-warning-100)',
                              margin: '0',
                            }
                          : {
                              margin: '0',
                            }
                      }
                    >
                      {isLoading ? (
                        <SkeletonLine width="30px" height={18} style={{ margin: '7px 0' }} />
                      ) : position ? (
                        config.amount > 0 ? (
                          Math.floor(Number(position.assets.amount) / config.amount)
                        ) : (
                          '—'
                        )
                      ) : null}
                    </Text>
                    <Text as="p" variant="p4" className={classNames.mutedText}>
                      How many trades can be funded at the set amount.
                    </Text>
                  </div>
                </div>
                <div className={classNames.amountInputsColumn}>
                  <div className={classNames.pricePreviewBlock}>
                    <Text as="p" variant="p3" className={classNames.mutedText}>
                      Balance covers strategy
                    </Text>
                    <Text
                      as="span"
                      variant="h5"
                      className={classNames.pricePreviewAmount}
                      style={
                        position
                          ? {
                              color:
                                config.amount > 0 &&
                                Number(position.assets.amount) >= config.amount * config.maxTrades
                                  ? 'var(--earn-protocol-success-100)'
                                  : 'var(--earn-protocol-warning-100)',
                              margin: '0',
                            }
                          : {
                              margin: '0',
                            }
                      }
                    >
                      {isLoading ? (
                        <SkeletonLine width="40px" height={18} style={{ margin: '7px 0' }} />
                      ) : position ? (
                        config.amount > 0 &&
                        Number(position.assets.amount) >= config.amount * config.maxTrades ? (
                          'Yes'
                        ) : (
                          'No'
                        )
                      ) : null}
                    </Text>
                    <Text as="p" variant="p4" className={classNames.mutedText}>
                      Whether the balance covers all {config.maxTrades} scheduled trades.
                    </Text>
                  </div>
                </div>
              </>
            ) : null}
            {!isLoading && (!position || Number(position.assetsUSD.amount) <= 0.001) ? (
              <div className={classNames.positionInfoEmpty}>
                <div className={classNames.pricePreviewBlock} style={{ textAlign: 'center' }}>
                  <Text as="p" variant="p4" className={classNames.mutedText}>
                    No position found in source vault, or vault balance is zero. To execute the DCA
                    strategy, you need to have an active position in the source vault with
                    sufficient balance. You can do that after creating the DCA strategy.
                  </Text>
                </div>
              </div>
            ) : null}
          </div>
        </DCAWizardStepCard>

        <DCAWizardStepCard title="Amount and frequency">
          <div className={classNames.amountSummaryRow}>
            <div className={classNames.amountInputsColumn}>
              <div className={classNames.pricePreviewBlock}>
                <Text as="p" variant="p3" className={classNames.mutedText}>
                  Amount per run
                </Text>
                <Text as="span" variant="h5" className={classNames.pricePreviewAmount}>
                  <TextNumberAnimated value={config.amount} variant="h5" /> {sourceSymbol}
                </Text>
              </div>
            </div>
            <div className={classNames.amountInputsColumn}>
              <div className={classNames.pricePreviewBlock}>
                <Text as="p" variant="p3" className={classNames.mutedText}>
                  Frequency
                </Text>
                <Text as="span" variant="h5" className={classNames.pricePreviewAmount}>
                  Every {frequencyDays > 1 ? frequencyDays : ''}{' '}
                  {frequencyDays === 1 ? 'day' : 'days'}
                </Text>
              </div>
            </div>
            <div className={classNames.amountInputsColumn}>
              <div className={classNames.pricePreviewBlock}>
                <Text as="p" variant="p3" className={classNames.mutedText}>
                  Full permit amount
                </Text>
                <Text as="span" variant="h5" className={classNames.pricePreviewAmount}>
                  {formatCryptoBalance(fullPermitAmount)} {sourceSymbol}
                </Text>
              </div>
            </div>
          </div>
        </DCAWizardStepCard>

        <DCAWizardStepCard title="Limits and conditions">
          <div className={classNames.conditionsStack}>
            {thresholdLabel && thresholdDescription ? (
              <div className={classNames.pricePreviewBlock}>
                <Text as="p" variant="p3" className={classNames.mutedText}>
                  {thresholdLabel}
                </Text>
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
                  <Text
                    as="span"
                    variant="h5"
                    className={classNames.pricePreviewAmount}
                    style={{ margin: '0' }}
                  >
                    {thresholdValue}
                  </Text>
                </Tooltip>
                <Text as="p" variant="p4" className={classNames.mutedText}>
                  {thresholdDescription}
                </Text>
              </div>
            ) : null}

            <div className={classNames.pricePreviewBlock}>
              <Text as="p" variant="p3" className={classNames.mutedText}>
                Max. Number of Trades
              </Text>
              <Text
                as="span"
                variant="h5"
                className={classNames.pricePreviewAmount}
                style={{ margin: '0' }}
              >
                {config.maxTrades === MAX_TRADES ? `${MAX_TRADES} (maximum)` : config.maxTrades}
              </Text>
              <Text as="p" variant="p4" className={classNames.mutedText}>
                Stop the strategy after this many successful trades.
              </Text>
            </div>

            <div className={classNames.pricePreviewBlock}>
              <Text as="p" variant="p3" className={classNames.mutedText}>
                Only trade until
              </Text>
              <Text
                as="span"
                variant="h5"
                className={classNames.pricePreviewAmount}
                style={{ margin: '0' }}
              >
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
        <DCAWizardStepCard title="Execute transactions">
          <PendingTransactionsList
            chainId={dcaChainId}
            transactions={[]}
            style={{
              marginTop: '2px',
            }}
          />
        </DCAWizardStepCard>
        {address && tosState.status !== TOSStatus.DONE && tosState.status !== TOSStatus.INIT ? (
          <DCAWizardStepCard title={tosSidebarProps.title}>
            {tosSidebarProps.content}
          </DCAWizardStepCard>
        ) : null}
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

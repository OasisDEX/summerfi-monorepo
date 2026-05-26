'use client'

import { type ChangeEvent, type FC, useCallback, useMemo, useState } from 'react'
import {
  Button,
  DatePicker,
  getDisplayToken,
  Icon,
  Input,
  Text,
  useAmount,
  useEarnProtocolLogin,
  useEarnProtocolWallet,
} from '@summerfi/app-earn-ui'
import { type IToken, type TokenSymbolsList } from '@summerfi/app-types'
import { subgraphNetworkToSDKId, supportedSDKNetwork, ten } from '@summerfi/app-utils'
import { DcaStrategyStatusEnum, type IArmadaDcaOrder } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'
import { useRouter } from 'next/navigation'

import { VaultSwitchBox } from '@/components/molecules/SidebarElements/VaultSwitchBox'
import { DCASidebar } from '@/features/dca/components/DCASidebar/DCASidebar'
import { DCAWizardStepCard } from '@/features/dca/components/DCAWizard/DCAWizardStepCard'
import { type DCAResolvedPair } from '@/features/dca/lib/types'
import { useAppSDK } from '@/hooks/use-app-sdk'

import classNames from '@/features/dca/components/dca.module.css'

interface DCAPositionViewProps {
  order: IArmadaDcaOrder
  pair: DCAResolvedPair
}

const SECONDS_PER_DAY = 24 * 60 * 60
const THRESHOLD_DECIMALS = 8

const formatStatus = (orderStatus: DcaStrategyStatusEnum) => {
  switch (orderStatus) {
    case DcaStrategyStatusEnum.Active:
      return 'Active'
    case DcaStrategyStatusEnum.Paused:
      return 'Paused'
    case DcaStrategyStatusEnum.Cancelled:
      return 'Cancelled'
    case DcaStrategyStatusEnum.Completed:
      return 'Completed'
    default:
      return orderStatus
  }
}

export const DCAPositionView: FC<DCAPositionViewProps> = ({ order: initialOrder, pair }) => {
  const { login } = useEarnProtocolLogin()
  const { walletClient, address } = useEarnProtocolWallet()
  const { cancelStrategyTx } = useAppSDK()
  const { refresh } = useRouter()

  const [order, setOrder] = useState<IArmadaDcaOrder>(initialOrder)
  const [isEditing, setIsEditing] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const chainId = useMemo(
    () => subgraphNetworkToSDKId(supportedSDKNetwork(pair.fromVault.protocol.network)),
    [pair.fromVault.protocol.network],
  )

  const sourceSymbol = getDisplayToken(pair.fromVault.inputToken.symbol)
  const targetSymbol = getDisplayToken(pair.toVault.inputToken.symbol)

  const frequencyDays = Math.max(1, Math.round(order.intervalSeconds / SECONDS_PER_DAY))
  const deadlineDate = order.deadlineUnixTimestamp
    ? new Date(order.deadlineUnixTimestamp * 1000)
    : undefined

  const isTargetEthVault = targetSymbol === 'ETH'
  const isSourceEthVault = sourceSymbol === 'ETH'
  const thresholdLabel = isTargetEthVault
    ? 'Never buy above'
    : isSourceEthVault
      ? 'Never sell below'
      : null
  const thresholdRaw = isTargetEthVault ? order.neverBuyAbove : order.neverSellBelow
  const thresholdDescription = isTargetEthVault
    ? `Skip executions when ${targetSymbol} trades above this price.`
    : isSourceEthVault
      ? `Skip executions when ${sourceSymbol} trades below this price.`
      : null

  // Local edit-mode buffers (UI only — persisting changes is not wired up yet)
  const [isAmountFocused, setIsAmountFocused] = useState(false)
  const [isThresholdFocused, setIsThresholdFocused] = useState(false)
  const [frequencyInput, setFrequencyInput] = useState(String(frequencyDays))
  const [maxTradesInput, setMaxTradesInput] = useState(String(order.maxTrades))
  const [deadlineInput, setDeadlineInput] = useState<Date | undefined>(deadlineDate)

  const {
    amountDisplay,
    handleAmountChange,
    manualSetAmount,
    onBlur: defaultAmountOnBlur,
    onFocus: defaultAmountOnFocus,
  } = useAmount({
    tokenDecimals: pair.fromVault.inputToken.decimals,
    selectedToken: {
      decimals: pair.fromVault.inputToken.decimals,
      symbol: sourceSymbol,
    } as IToken,
    initialAmount: new BigNumber(order.amount)
      .div(ten.pow(pair.fromVault.inputToken.decimals))
      .toString(),
    inputChangeHandler: () => undefined,
    inputName: 'dca-position-amount',
  })

  const {
    amountDisplay: thresholdDisplay,
    handleAmountChange: handleThresholdAmountChange,
    manualSetAmount: manualSetThreshold,
    onBlur: defaultThresholdOnBlur,
    onFocus: defaultThresholdOnFocus,
  } = useAmount({
    tokenDecimals: THRESHOLD_DECIMALS,
    selectedToken: {
      decimals: THRESHOLD_DECIMALS,
      symbol: 'USD',
    } as IToken,
    initialAmount: thresholdRaw,
    inputChangeHandler: () => undefined,
    inputName: 'dca-position-threshold',
  })

  const onAmountInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    if (ev.target.value === '') {
      manualSetAmount(undefined)

      return
    }

    handleAmountChange(ev)
  }

  const onThresholdInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    if (ev.target.value === '') {
      manualSetThreshold(undefined)

      return
    }

    handleThresholdAmountChange(ev)
  }

  const canCancel =
    order.status === DcaStrategyStatusEnum.Active || order.status === DcaStrategyStatusEnum.Paused

  const handleCancel = useCallback(async () => {
    if (!address || !walletClient) {
      setErrorMessage('Connect your wallet to cancel this DCA strategy.')

      return
    }

    setIsCancelling(true)
    setErrorMessage(null)

    try {
      const [txInfo] = await cancelStrategyTx({
        chainId,
        strategyId: order.id,
      })

      await walletClient.sendTransaction({
        account: walletClient.account ?? (address as `0x${string}`),
        to: txInfo.transaction.targetContract.value as `0x${string}`,
        data: txInfo.transaction.calldata as `0x${string}`,
        chain: null,
      })

      refresh()
    } catch (error) {
      const isRejected = error instanceof Error && /rejected|denied/iu.test(error.message)

      if (!isRejected) {
        // eslint-disable-next-line no-console
        console.error('Failed to cancel DCA strategy:', error)
      }

      setErrorMessage(
        isRejected
          ? 'Signature rejected. Please confirm in your wallet to cancel.'
          : 'Failed to cancel DCA strategy.',
      )
    } finally {
      setIsCancelling(false)
    }
  }, [address, cancelStrategyTx, chainId, order.id, refresh, walletClient])

  const cancelButton = useMemo(() => {
    if (!address) {
      return { label: 'Connect Wallet', action: login, disabled: false }
    }

    return {
      label: isCancelling ? 'Cancelling…' : 'Cancel DCA',
      action: handleCancel,
      disabled: isCancelling || !canCancel,
    }
  }, [address, canCancel, handleCancel, isCancelling, login])

  return (
    <div className={classNames.layout}>
      <div className={classNames.wizardColumn}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 'var(--general-space-12)',
          }}
        >
          <Text as="h3" variant="h4">
            Your DCA strategy
          </Text>
          <Text as="span" variant="p3" style={{ color: 'var(--color-text-secondary)' }}>
            Status: {formatStatus(order.status)}
          </Text>
        </div>

        <DCAWizardStepCard title="Your vaults">
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
              style={{ pointerEvents: 'none', cursor: 'default' }}
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
          <div className={classNames.amountRow}>
            <div className={classNames.amountInputsColumn}>
              <div className={classNames.pricePreviewBlock}>
                <Text as="p" variant="p3" className={classNames.mutedText}>
                  Amount per run
                </Text>
                {isEditing ? (
                  <Input
                    variant="dark"
                    inputMode="decimal"
                    value={amountDisplay}
                    inputWrapperStyles={{ border: '1px solid var(--earn-protocol-neutral-80)' }}
                    onChange={onAmountInputChange}
                    onFocus={() => {
                      setIsAmountFocused(true)
                      defaultAmountOnFocus()
                    }}
                    onBlur={() => {
                      setIsAmountFocused(false)
                      defaultAmountOnBlur()
                    }}
                    button={
                      isAmountFocused ? null : (
                        <Text as="span" variant="p2semi" className={classNames.amountUnit}>
                          {sourceSymbol}
                        </Text>
                      )
                    }
                  />
                ) : (
                  <Text as="span" variant="h5" className={classNames.pricePreviewAmount}>
                    {amountDisplay} {sourceSymbol}
                  </Text>
                )}
              </div>
            </div>
            <div className={classNames.amountInputsColumn}>
              <div className={classNames.pricePreviewBlock}>
                <Text as="p" variant="p3" className={classNames.mutedText}>
                  Frequency
                </Text>
                {isEditing ? (
                  <Input
                    variant="dark"
                    inputMode="numeric"
                    value={frequencyInput}
                    inputWrapperStyles={{ border: '1px solid var(--earn-protocol-neutral-80)' }}
                    onChange={(ev) => setFrequencyInput(ev.target.value)}
                    button={
                      <Text as="span" variant="p2semi" className={classNames.amountUnit}>
                        Days
                      </Text>
                    }
                  />
                ) : (
                  <Text as="span" variant="h5" className={classNames.pricePreviewAmount}>
                    Every {frequencyDays} {frequencyDays === 1 ? 'day' : 'days'}
                  </Text>
                )}
              </div>
            </div>
          </div>
        </DCAWizardStepCard>

        <DCAWizardStepCard title="Advanced configuration">
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
                {isEditing ? (
                  <Input
                    variant="dark"
                    inputMode="decimal"
                    value={thresholdDisplay}
                    onChange={onThresholdInputChange}
                    onFocus={() => {
                      setIsThresholdFocused(true)
                      defaultThresholdOnFocus()
                    }}
                    onBlur={() => {
                      setIsThresholdFocused(false)
                      defaultThresholdOnBlur()
                    }}
                    button={
                      isThresholdFocused ? null : (
                        <Text as="span" variant="p2semi" className={classNames.amountUnit}>
                          {isTargetEthVault
                            ? `${targetSymbol}/${sourceSymbol}`
                            : `${sourceSymbol}/${targetSymbol}`}
                        </Text>
                      )
                    }
                  />
                ) : (
                  <Text as="span" variant="h5" className={classNames.pricePreviewAmount}>
                    {thresholdRaw ? (
                      <>
                        {thresholdRaw}{' '}
                        <Text
                          as="span"
                          variant="p4semi"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          {isTargetEthVault
                            ? `${targetSymbol}/${sourceSymbol}`
                            : `${sourceSymbol}/${targetSymbol}`}
                        </Text>
                      </>
                    ) : (
                      'Not set'
                    )}
                  </Text>
                )}
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
              {isEditing ? (
                <Input
                  variant="dark"
                  inputMode="numeric"
                  value={maxTradesInput}
                  onChange={(ev) => setMaxTradesInput(ev.target.value)}
                />
              ) : (
                <Text as="span" variant="h5" className={classNames.pricePreviewAmount}>
                  {order.maxTrades === 1000 ? '1000 (maximum)' : order.maxTrades}
                </Text>
              )}
              <Text as="p" variant="p4" className={classNames.mutedText}>
                Stop the strategy after this many successful trades. ({order.tradesExecuted}{' '}
                executed)
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
              {isEditing ? (
                <DatePicker
                  isMobile={false}
                  onChange={(date) => setDeadlineInput(date)}
                  value={deadlineInput}
                />
              ) : (
                <Text as="span" variant="h5" className={classNames.pricePreviewAmount}>
                  {deadlineDate ? deadlineDate.toLocaleDateString('en-GB') : 'Not set'}
                </Text>
              )}
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
          <Button
            variant="secondaryLarge"
            onClick={() => setIsEditing((value) => !value)}
            disabled={!canCancel}
          >
            {isEditing ? 'Done' : 'Edit'}
          </Button>
          <Button
            variant="secondaryLarge"
            onClick={cancelButton.action}
            disabled={cancelButton.disabled}
          >
            {cancelButton.label}
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

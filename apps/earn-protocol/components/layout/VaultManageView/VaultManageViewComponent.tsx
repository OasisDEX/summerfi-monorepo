import { useMemo, useState } from 'react'
import { useUser } from '@account-kit/react'
import {
  Expander,
  Sidebar,
  SidebarFootnote,
  sidebarFootnote,
  SidebarMobileHeader,
  type SidebarProps,
  Text,
  useForecast,
  useMobileCheck,
  useTokenSelector,
  VaultManageGrid,
} from '@summerfi/app-earn-ui'
import {
  type SDKUsersActivityType,
  type SDKVaultishType,
  type SDKVaultsListType,
  type SDKVaultType,
  TransactionAction,
  type UsersActivity,
} from '@summerfi/app-types'
import { zero } from '@summerfi/app-utils'
import { type IArmadaPosition } from '@summerfi/sdk-client'
import BigNumber from 'bignumber.js'

import {
  ControlsApproval,
  ControlsDepositWithdraw,
  OrderInfoDeposit,
  OrderInfoWithdraw,
} from '@/components/molecules/SidebarElements'
import { TransactionHashPill } from '@/components/molecules/TransactionHashPill/TransactionHashPill'
import { PositionPerformanceChart } from '@/components/organisms/Charts/PositionPerformanceChart'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { RebalancingActivity } from '@/features/rebalance-activity/components/RebalancingActivity/RebalancingActivity'
import { UserActivity } from '@/features/user-activity/components/UserActivity/UserActivity'
import { VaultExposure } from '@/features/vault-exposure/components/VaultExposure/VaultExposure'
import { useAmount } from '@/hooks/use-amount'
import { useClient } from '@/hooks/use-client'
import { useSwapQuote } from '@/hooks/use-swap-quote'
import { useTokenBalance } from '@/hooks/use-token-balance'
import { useTransaction } from '@/hooks/use-transaction'

import vaultManageViewStyles from './VaultManageView.module.scss'

export const VaultManageViewComponent = ({
  vault,
  vaults,
  position,
  userActivity,
  topDepositors,
  viewWalletAddress,
}: {
  vault: SDKVaultType | SDKVaultishType
  vaults: SDKVaultsListType
  position: IArmadaPosition
  userActivity: UsersActivity
  topDepositors: SDKUsersActivityType
  viewWalletAddress: string
}) => {
  const user = useUser()
  const { publicClient } = useClient()

  const { handleTokenSelectionChange, selectedTokenOption, tokenOptions } = useTokenSelector({
    vault,
  })

  const {
    vaultToken,
    token: selectedToken,
    tokenBalance: selectedTokenBalance,
    tokenBalanceLoading: selectedTokenBalanceLoading,
  } = useTokenBalance({
    publicClient,
    vaultTokenSymbol: vault.inputToken.symbol,
    tokenSymbol: selectedTokenOption.value,
  })

  const {
    amountParsed,
    manualSetAmount,
    amountDisplay,
    amountDisplayUSD,
    handleAmountChange,
    onBlur,
    onFocus,
  } = useAmount({ vault, selectedToken })

  const {
    sidebar,
    txHashes,
    removeTxHash,
    vaultChainId,
    reset,
    transactionType,
    setTransactionType,
    nextTransaction,
    approvalType,
    setApprovalType,
    setApprovalCustomValue,
    approvalCustomValue,
    backToInit,
  } = useTransaction({
    vault,
    amount: amountParsed,
    manualSetAmount,
    publicClient,
    token: selectedToken,
    vaultToken,
    tokenBalance: selectedTokenBalance,
    tokenBalanceLoading: selectedTokenBalanceLoading,
    flow: 'manage',
  })

  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const ownerView = viewWalletAddress.toLowerCase() === user?.address.toLowerCase()

  const positionAmount = useMemo(() => {
    return new BigNumber(position.amount.amount)
  }, [position])

  const { isLoadingForecast, oneYearEarningsForecast } = useForecast({
    fleetAddress: vault.id,
    chainId: vaultChainId,
    amount: {
      [TransactionAction.DEPOSIT]: amountParsed.plus(positionAmount),
      [TransactionAction.WITHDRAW]: positionAmount.minus(amountParsed).lt(zero)
        ? zero
        : positionAmount.minus(amountParsed),
    }[transactionType].toString(),
  })

  const estimatedEarnings = useMemo(() => {
    if (!oneYearEarningsForecast) return '0'

    return oneYearEarningsForecast
  }, [oneYearEarningsForecast])

  const fromTokenSymbol: string = useMemo(() => {
    return {
      [TransactionAction.DEPOSIT]: selectedTokenOption.value,
      [TransactionAction.WITHDRAW]: vault.inputToken.symbol,
    }[transactionType]
  }, [transactionType, selectedTokenOption.value, vault.inputToken.symbol])

  const toTokenSymbol: string = useMemo(() => {
    return {
      [TransactionAction.DEPOSIT]: vault.inputToken.symbol,
      [TransactionAction.WITHDRAW]: selectedTokenOption.value,
    }[transactionType]
  }, [transactionType, selectedTokenOption.value, vault.inputToken.symbol])

  const { quote, quoteLoading } = useSwapQuote({
    fromTokenSymbol,
    fromAmount: amountDisplay,
    toTokenSymbol,
    slippage: 0.01,
  })

  const amountDisplayUSDWithSwap = useMemo(() => {
    if (quoteLoading) {
      return 'Loading...'
    }

    return quote !== undefined
      ? `$${quote.toTokenAmount.toBigNumber().toFixed(vault.inputToken.decimals)}`
      : amountDisplayUSD
  }, [quote, quoteLoading, amountDisplayUSD, vault.inputToken.decimals])

  const sidebarContent = nextTransaction?.label ? (
    {
      approve: (
        <ControlsApproval
          vault={vault}
          approvalType={approvalType}
          setApprovalType={setApprovalType}
          setApprovalCustomValue={setApprovalCustomValue}
          approvalCustomValue={approvalCustomValue}
          tokenBalance={selectedTokenBalance}
        />
      ),
      deposit: (
        <OrderInfoDeposit
          vault={vault}
          amountParsed={amountParsed}
          amountDisplayUSD={amountDisplayUSD}
        />
      ),
      withdraw: (
        <OrderInfoWithdraw
          vault={vault}
          amountParsed={amountParsed}
          amountDisplayUSD={amountDisplayUSD}
        />
      ),
    }[nextTransaction.label]
  ) : (
    <ControlsDepositWithdraw
      amountDisplay={amountDisplay}
      amountDisplayUSD={amountDisplayUSDWithSwap}
      handleAmountChange={handleAmountChange}
      handleDropdownChange={handleTokenSelectionChange}
      options={tokenOptions}
      dropdownValue={selectedTokenOption}
      onFocus={onFocus}
      onBlur={onBlur}
      tokenSymbol={
        {
          [TransactionAction.DEPOSIT]: selectedTokenOption.value,
          [TransactionAction.WITHDRAW]: vault.inputToken.symbol,
        }[transactionType]
      }
      tokenBalance={
        {
          [TransactionAction.DEPOSIT]: selectedTokenBalance,
          [TransactionAction.WITHDRAW]: ownerView ? positionAmount : undefined,
        }[transactionType]
      }
      tokenBalanceLoading={selectedTokenBalanceLoading}
      manualSetAmount={manualSetAmount}
      vault={vault}
      estimatedEarnings={estimatedEarnings}
      isLoadingForecast={isLoadingForecast}
    />
  )

  const sidebarProps: SidebarProps = {
    title: !nextTransaction ? transactionType : sidebar.title,
    titleTabs: !nextTransaction
      ? [TransactionAction.DEPOSIT, TransactionAction.WITHDRAW]
      : undefined,
    onTitleTabChange: (action) => {
      setTransactionType(action as TransactionAction)
      if (amountParsed.gt(0)) {
        reset()
      }
    },
    content: sidebarContent,
    customHeader:
      !isDrawerOpen && isMobile ? (
        <SidebarMobileHeader
          type="manage"
          transactionType={transactionType}
          setTransactionType={setTransactionType}
        />
      ) : undefined,
    customHeaderStyles:
      !isDrawerOpen && isMobile ? { padding: 'var(--general-space-12) 0' } : undefined,
    handleIsDrawerOpen: (flag: boolean) => setIsDrawerOpen(flag),
    goBackAction: nextTransaction?.label ? backToInit : undefined,
    primaryButton: sidebar.primaryButton,
    footnote: (
      <>
        {txHashes.map((transactionData) => (
          <TransactionHashPill
            key={transactionData.hash}
            transactionData={transactionData}
            removeTxHash={removeTxHash}
            chainId={vaultChainId}
          />
        ))}
        <SidebarFootnote
          title={sidebarFootnote.title}
          list={sidebarFootnote.list}
          tooltip={sidebarFootnote.tooltip}
        />
      </>
    ),
    error: sidebar.error,
    isMobile,
  }

  // needed due to type duality
  const rebalancesList = `rebalances` in vault ? vault.rebalances : []

  return (
    <VaultManageGrid
      vault={vault}
      vaults={vaults}
      position={position}
      viewWalletAddress={viewWalletAddress}
      connectedWalletAddress={user?.address}
      detailsContent={
        <div className={vaultManageViewStyles.leftContentWrapper}>
          <Expander
            title={
              <Text as="p" variant="p1semi">
                Performance
              </Text>
            }
            defaultExpanded
          >
            <PositionPerformanceChart chartData={vault.customFields?.performanceChartData} />
          </Expander>
          <Expander
            title={
              <Text as="p" variant="p1semi">
                Vault exposure
              </Text>
            }
            defaultExpanded
          >
            <VaultExposure vault={vault as SDKVaultType} />
          </Expander>
          <Expander
            title={
              <Text as="p" variant="p1semi">
                Rebalancing activity
              </Text>
            }
            defaultExpanded
          >
            <RebalancingActivity rebalancesList={rebalancesList} vaultId={vault.id} />
          </Expander>
          <Expander
            title={
              <Text as="p" variant="p1semi">
                User activity
              </Text>
            }
            defaultExpanded
          >
            <UserActivity
              userActivity={userActivity}
              topDepositors={topDepositors}
              vaultId={vault.id}
              page="manage"
            />
          </Expander>
        </div>
      }
      sidebarContent={<Sidebar {...sidebarProps} />}
      isMobile={isMobile}
    />
  )
}

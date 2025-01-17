import { useMemo, useState } from 'react'
import { useUser } from '@account-kit/react'
import {
  ControlsDepositWithdraw,
  Expander,
  NonOwnerPositionBanner,
  Sidebar,
  SidebarFootnote,
  sidebarFootnote,
  SidebarMobileHeader,
  type SidebarProps,
  Text,
  useAmount,
  useAmountWithSwap,
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
import { subgraphNetworkToSDKId, zero } from '@summerfi/app-utils'
import { type IArmadaPosition } from '@summerfi/sdk-client'
import { TransactionType } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'

import {
  ControlsApproval,
  OrderInfoDeposit,
  OrderInfoWithdraw,
} from '@/components/molecules/SidebarElements'
import { TransactionHashPill } from '@/components/molecules/TransactionHashPill/TransactionHashPill'
import { PositionPerformanceChart } from '@/components/organisms/Charts/PositionPerformanceChart'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { useSlippageConfig } from '@/features/nav-config/hooks/useSlippageConfig'
import { RebalancingActivity } from '@/features/rebalance-activity/components/RebalancingActivity/RebalancingActivity'
import { UserActivity } from '@/features/user-activity/components/UserActivity/UserActivity'
import { VaultExposure } from '@/features/vault-exposure/components/VaultExposure/VaultExposure'
import { getResolvedForecastAmountParsed } from '@/helpers/get-resolved-forecast-amount-parsed'
import { useAppSDK } from '@/hooks/use-app-sdk'
import { useGasEstimation } from '@/hooks/use-gas-estimation'
import { useNetworkAlignedClient } from '@/hooks/use-network-aligned-client'
import { useTokenBalance } from '@/hooks/use-token-balance'
import { useTransaction } from '@/hooks/use-transaction'
import { useUserWallet } from '@/hooks/use-user-wallet'

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
  const { userWalletAddress } = useUserWallet()
  const ownerView = viewWalletAddress.toLowerCase() === userWalletAddress?.toLowerCase()
  const { publicClient } = useNetworkAlignedClient()

  const vaultChainId = subgraphNetworkToSDKId(vault.protocol.network)

  const { handleTokenSelectionChange, selectedTokenOption, tokenOptions } = useTokenSelector({
    vault,
    chainId: vaultChainId,
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
    chainId: vaultChainId,
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
    amountParsed: approvalAmountParsed,
    amountDisplay: approvalCustomAmount,
    handleAmountChange: approvalHandleAmountChange,
    onBlur: approvalOnBlur,
    onFocus: approvalOnFocus,
    manualSetAmount: approvalManualSetAmount,
  } = useAmount({ vault, selectedToken, initialAmount: amountParsed.toString() })

  const positionAmount = useMemo(() => {
    return new BigNumber(position.amount.amount)
  }, [position])

  const {
    sidebar,
    txHashes,
    removeTxHash,
    reset,
    transactionType,
    setTransactionType,
    nextTransaction,
    approvalType,
    setApprovalType,
    backToInit,
  } = useTransaction({
    vault,
    vaultChainId,
    amount: amountParsed,
    manualSetAmount,
    publicClient,
    vaultToken,
    token: selectedToken,
    tokenBalance: selectedTokenBalance,
    tokenBalanceLoading: selectedTokenBalanceLoading,
    flow: 'manage',
    ownerView,
    positionAmount,
    approvalCustomValue: approvalAmountParsed,
  })

  const sdk = useAppSDK()
  const [slippageConfig] = useSlippageConfig()

  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const { amountDisplayUSDWithSwap, fromTokenSymbol, rawToTokenAmount } = useAmountWithSwap({
    vault,
    vaultChainId,
    amountDisplay,
    amountDisplayUSD,
    transactionType,
    selectedTokenOption,
    sdk,
    slippageConfig,
  })

  const resolvedAmountParsed = getResolvedForecastAmountParsed({
    amountParsed,
    rawToTokenAmount,
  })

  const { isLoadingForecast, oneYearEarningsForecast } = useForecast({
    fleetAddress: vault.id,
    chainId: vaultChainId,
    amount: {
      [TransactionAction.DEPOSIT]: resolvedAmountParsed.plus(positionAmount),
      [TransactionAction.WITHDRAW]: positionAmount.minus(resolvedAmountParsed).lt(zero)
        ? zero
        : positionAmount.minus(resolvedAmountParsed),
    }[transactionType].toString(),
    disabled: !ownerView,
    isEarnApp: true,
  })

  const estimatedEarnings = useMemo(() => {
    if (!oneYearEarningsForecast) return '0'

    return oneYearEarningsForecast
  }, [oneYearEarningsForecast])

  const { transactionFee, loading: transactionFeeLoading } = useGasEstimation({
    chainId: vaultChainId,
    transaction: nextTransaction,
    walletAddress: user?.address,
  })

  const sidebarContent = nextTransaction?.type ? (
    {
      [TransactionType.Approve]: (
        <ControlsApproval
          tokenSymbol={fromTokenSymbol}
          approvalType={approvalType}
          setApprovalType={setApprovalType}
          setApprovalCustomValue={approvalHandleAmountChange}
          approvalCustomValue={approvalCustomAmount}
          customApprovalManualSetAmount={approvalManualSetAmount}
          customApprovalOnBlur={approvalOnBlur}
          customApprovalOnFocus={approvalOnFocus}
          tokenBalance={selectedTokenBalance}
        />
      ),
      [TransactionType.Deposit]: (
        <OrderInfoDeposit
          transaction={nextTransaction}
          amountParsed={amountParsed}
          amountDisplayUSD={amountDisplayUSDWithSwap}
          transactionFee={transactionFee}
          transactionFeeLoading={transactionFeeLoading}
        />
      ),
      [TransactionType.Withdraw]: (
        <OrderInfoWithdraw
          transaction={nextTransaction}
          amountParsed={amountParsed}
          amountDisplayUSD={amountDisplayUSDWithSwap}
          transactionFee={transactionFee}
          transactionFeeLoading={transactionFeeLoading}
        />
      ),
    }[nextTransaction.type]
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
      ownerView={ownerView}
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
    goBackAction: nextTransaction?.type ? backToInit : undefined,
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
    <>
      <NonOwnerPositionBanner isOwner={ownerView} />
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
              <PositionPerformanceChart
                chartData={vault.customFields?.performanceChartData}
                inputToken={vault.inputToken.symbol}
              />
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
              <RebalancingActivity
                rebalancesList={rebalancesList}
                vaultId={vault.id}
                totalRebalances={Number(vault.rebalanceCount)}
              />
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
    </>
  )
}

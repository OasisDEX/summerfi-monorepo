import { useMemo, useState } from 'react'
import { useUser } from '@account-kit/react'
import {
  Card,
  ControlsDepositWithdraw,
  Expander,
  getDisplayToken,
  getPositionValues,
  getUniqueVaultId,
  NonOwnerPositionBanner,
  Sidebar,
  SidebarFootnote,
  sidebarFootnote,
  SidebarMobileHeader,
  type SidebarProps,
  SUMR_CAP,
  Text,
  useAmount,
  useAmountWithSwap,
  useForecast,
  useLocalConfig,
  useMobileCheck,
  useTokenSelector,
  VaultManageGrid,
} from '@summerfi/app-earn-ui'
import { useTermsOfService } from '@summerfi/app-tos'
import {
  type ArksHistoricalChartData,
  type PerformanceChartData,
  type SDKUsersActivityType,
  type SDKVaultishType,
  type SDKVaultsListType,
  type SDKVaultType,
  TOSStatus,
  TransactionAction,
  type UsersActivity,
} from '@summerfi/app-types'
import { formatDecimalAsPercent, subgraphNetworkToSDKId, zero } from '@summerfi/app-utils'
import { type GetGlobalRebalancesQuery, type IArmadaPosition } from '@summerfi/sdk-client'
import { TransactionType } from '@summerfi/sdk-common'

import { AccountKitAccountType } from '@/account-kit/types'
import { VaultSimulationGraph } from '@/components/layout/VaultOpenView/VaultSimulationGraph'
import {
  ControlsApproval,
  OrderInfoDeposit,
  OrderInfoWithdraw,
} from '@/components/molecules/SidebarElements'
import { TransactionHashPill } from '@/components/molecules/TransactionHashPill/TransactionHashPill'
import { ArkHistoricalYieldChart } from '@/components/organisms/Charts/ArkHistoricalYieldChart'
import { PositionPerformanceChart } from '@/components/organisms/Charts/PositionPerformanceChart'
import { TermsOfServiceCookiePrefix, TermsOfServiceVersion } from '@/constants/terms-of-service'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { RebalancingActivity } from '@/features/rebalance-activity/components/RebalancingActivity/RebalancingActivity'
import { UserActivity } from '@/features/user-activity/components/UserActivity/UserActivity'
import { VaultExposure } from '@/features/vault-exposure/components/VaultExposure/VaultExposure'
import { getResolvedForecastAmountParsed } from '@/helpers/get-resolved-forecast-amount-parsed'
import { revalidatePositionData } from '@/helpers/revalidation-handlers'
import { useAppSDK } from '@/hooks/use-app-sdk'
import { useGasEstimation } from '@/hooks/use-gas-estimation'
import { useNetworkAlignedClient } from '@/hooks/use-network-aligned-client'
import { useTermsOfServiceSidebar } from '@/hooks/use-terms-of-service-sidebar'
import { useTermsOfServiceSigner } from '@/hooks/use-terms-of-service-signer'
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
  performanceChartData,
  arksHistoricalChartData,
  arksInterestRates,
  vaultApy,
}: {
  vault: SDKVaultType | SDKVaultishType
  vaults: SDKVaultsListType
  position: IArmadaPosition
  userActivity: UsersActivity
  topDepositors: SDKUsersActivityType
  viewWalletAddress: string
  performanceChartData: PerformanceChartData
  arksHistoricalChartData: ArksHistoricalChartData
  arksInterestRates?: { [key: string]: number }
  vaultApy?: number
}) => {
  const user = useUser()
  const { userWalletAddress, isLoadingAccount } = useUserWallet()
  const ownerView = viewWalletAddress.toLowerCase() === userWalletAddress?.toLowerCase()
  const { publicClient } = useNetworkAlignedClient()

  const vaultChainId = subgraphNetworkToSDKId(vault.protocol.network)

  const { handleTokenSelectionChange, selectedTokenOption, tokenOptions, tokenOptionsNoSwap } =
    useTokenSelector({
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
  } = useAmount({
    tokenDecimals: vault.inputToken.decimals,
    tokenPrice: vault.inputTokenPriceUSD,
    selectedToken,
  })

  const {
    amountParsed: approvalAmountParsed,
    amountDisplay: approvalCustomAmount,
    handleAmountChange: approvalHandleAmountChange,
    onBlur: approvalOnBlur,
    onFocus: approvalOnFocus,
    manualSetAmount: approvalManualSetAmount,
  } = useAmount({
    tokenDecimals: vault.inputToken.decimals,
    tokenPrice: vault.inputTokenPriceUSD,
    selectedToken,
    initialAmount: amountParsed.toString(),
  })

  const { netValue } = getPositionValues({
    position,
    vault,
  })

  const {
    sidebar,
    txHashes,
    removeTxHash,
    reset,
    transactionType,
    setTransactionType,
    nextTransaction,
    approvalType,
    approvalTokenSymbol,
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
    positionAmount: netValue,
    approvalCustomValue: approvalAmountParsed,
  })

  const sdk = useAppSDK()
  const {
    state: { sumrNetApyConfig, slippageConfig },
  } = useLocalConfig()

  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const { amountDisplayUSDWithSwap, rawToTokenAmount } = useAmountWithSwap({
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

  const { isLoadingForecast, oneYearEarningsForecast, forecast, forecastSummaryMap } = useForecast({
    fleetAddress: vault.id,
    chainId: vaultChainId,
    amount: {
      [TransactionAction.DEPOSIT]: resolvedAmountParsed.plus(netValue),
      [TransactionAction.WITHDRAW]: netValue.minus(resolvedAmountParsed).lt(zero)
        ? zero
        : netValue.minus(resolvedAmountParsed),
    }[transactionType].toString(),
    disabled: !ownerView,
    isEarnApp: true,
  })

  const signTosMessage = useTermsOfServiceSigner()

  const tosState = useTermsOfService({
    publicClient,
    signMessage: signTosMessage,
    chainId: vaultChainId,
    walletAddress: user?.address,
    isSmartAccount: user?.type === AccountKitAccountType.SCA,
    version: TermsOfServiceVersion.APP_VERSION,
    cookiePrefix: TermsOfServiceCookiePrefix.APP_TOKEN,
    host: '/earn',
    type: 'default',
  })

  const { tosSidebarProps } = useTermsOfServiceSidebar({ tosState, handleGoBack: backToInit })

  const displaySimulationGraph = resolvedAmountParsed.gt(0)

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
          tokenSymbol={approvalTokenSymbol}
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
      transactionType={transactionType}
      options={transactionType === TransactionAction.WITHDRAW ? tokenOptionsNoSwap : tokenOptions}
      dropdownValue={selectedTokenOption}
      onFocus={onFocus}
      onBlur={onBlur}
      ownerView={ownerView}
      tokenSymbol={
        {
          [TransactionAction.DEPOSIT]: selectedTokenOption.value,
          [TransactionAction.WITHDRAW]: getDisplayToken(vault.inputToken.symbol),
        }[transactionType]
      }
      tokenBalance={
        {
          [TransactionAction.DEPOSIT]: selectedTokenBalance,
          [TransactionAction.WITHDRAW]: ownerView ? netValue : undefined,
        }[transactionType]
      }
      tokenBalanceLoading={selectedTokenBalanceLoading}
      manualSetAmount={manualSetAmount}
      vault={vault}
      estimatedEarnings={estimatedEarnings}
      forecastSummaryMap={forecastSummaryMap}
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

  const nextTransactionType = nextTransaction?.type

  const resovledSidebarProps =
    tosState.status !== TOSStatus.DONE &&
    nextTransactionType &&
    [TransactionType.Approve, TransactionType.Deposit, TransactionType.Withdraw].includes(
      nextTransactionType,
    )
      ? tosSidebarProps
      : sidebarProps

  // needed due to type duality
  const rebalancesList =
    `rebalances` in vault ? (vault.rebalances as GetGlobalRebalancesQuery['rebalances']) : []

  const estimatedSumrPrice = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP

  // "It’s 1% for usd and 0.3% for eth"
  const managementFee = vault.inputToken.symbol.includes('USD') ? 0.01 : 0.003

  return (
    <>
      <NonOwnerPositionBanner isOwner={ownerView} walletStateLoaded={!isLoadingAccount} />
      <VaultManageGrid
        vault={vault}
        vaultApy={vaultApy}
        vaults={vaults}
        position={position}
        onRefresh={revalidatePositionData}
        viewWalletAddress={viewWalletAddress}
        connectedWalletAddress={user?.address}
        displaySimulationGraph={displaySimulationGraph}
        simulationGraph={
          <VaultSimulationGraph
            vault={vault}
            forecast={forecast}
            isLoadingForecast={isLoadingForecast}
            amount={amountParsed}
          />
        }
        sumrPrice={estimatedSumrPrice}
        detailsContent={[
          <div className={vaultManageViewStyles.leftContentWrapper} key="PerformanceBlock">
            <Expander
              title={
                <Text as="p" variant="p1semi">
                  Performance
                </Text>
              }
              defaultExpanded
            >
              <PositionPerformanceChart
                chartData={performanceChartData}
                inputToken={getDisplayToken(vault.inputToken.symbol)}
              />
            </Expander>
          </div>,
          <div className={vaultManageViewStyles.leftContentWrapper} key="AboutTheStrategy">
            <div>
              <Text
                as="p"
                variant="p1semi"
                style={{
                  marginBottom: 'var(--spacing-space-medium)',
                }}
              >
                About the strategy
              </Text>
              <Text
                as="p"
                variant="p2"
                style={{
                  color: 'var(--color-text-secondary)',
                }}
              >
                The Summer Earn Protocol is a permissionless passive lending product, which sets out
                to offer effortless and secure optimised yield, while diversifying risk.
              </Text>
            </div>
            <Expander
              title={
                <Text as="p" variant="p1semi">
                  Historical yield
                </Text>
              }
            >
              <ArkHistoricalYieldChart
                chartData={arksHistoricalChartData}
                summerVaultName={
                  vault.customFields?.name ?? `Summer ${vault.inputToken.symbol} Vault`
                }
              />
            </Expander>
            <Expander
              title={
                <Text as="p" variant="p1semi">
                  Vault exposure
                </Text>
              }
            >
              <VaultExposure vault={vault as SDKVaultType} arksInterestRates={arksInterestRates} />
            </Expander>
            <Expander
              title={
                <Text as="p" variant="p1semi">
                  Strategy management fee
                </Text>
              }
            >
              <Card style={{ flexDirection: 'column', marginTop: 'var(--general-space-16)' }}>
                <Text
                  as="p"
                  variant="p2semi"
                  style={{
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--general-space-24)',
                  }}
                >
                  {formatDecimalAsPercent(managementFee)} Management Fee, already included in APY
                </Text>
                <Text
                  as="p"
                  variant="p2"
                  style={{
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  A {formatDecimalAsPercent(managementFee)} management fee is applied to your
                  position, but it’s already factored into the APY you see. This means the rate
                  displayed reflects your net return - no hidden fees, just straightforward
                  earnings.
                </Text>
              </Card>
            </Expander>
            <Expander
              title={
                <Text as="p" variant="p1semi">
                  Rebalancing activity
                </Text>
              }
            >
              <RebalancingActivity
                rebalancesList={rebalancesList}
                vaultId={getUniqueVaultId(vault)}
                totalRebalances={Number(vault.rebalanceCount)}
                vaultsList={vaults}
              />
            </Expander>
            <Expander
              title={
                <Text as="p" variant="p1semi">
                  User activity
                </Text>
              }
            >
              <UserActivity
                userActivity={userActivity}
                topDepositors={topDepositors}
                vaultId={getUniqueVaultId(vault)}
                page="manage"
                noHighlight
              />
            </Expander>
          </div>,
        ]}
        sidebarContent={<Sidebar {...resovledSidebarProps} />}
        isMobile={isMobile}
      />
    </>
  )
}

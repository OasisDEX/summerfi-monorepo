import { useEffect, useMemo, useState } from 'react'
import { useUser } from '@account-kit/react'
import {
  Card,
  ControlsDepositWithdraw,
  Expander,
  getDisplayToken,
  getMigrationLandingPageUrl,
  getPositionValues,
  getUniqueVaultId,
  getVaultDetailsUrl,
  NonOwnerPositionBanner,
  ProjectedEarningsCombined,
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
  useLocalStorageOnce,
  useMobileCheck,
  useTokenSelector,
  VaultManageGrid,
  WithArrow,
} from '@summerfi/app-earn-ui'
import { useTermsOfService } from '@summerfi/app-tos'
import {
  type ArksHistoricalChartData,
  type PerformanceChartData,
  type SDKVaultishType,
  type SDKVaultsListType,
  type SDKVaultType,
  TOSStatus,
  TransactionAction,
  type VaultApyData,
} from '@summerfi/app-types'
import { formatDecimalAsPercent, subgraphNetworkToSDKId, zero } from '@summerfi/app-utils'
import { type IArmadaPosition } from '@summerfi/sdk-client'
import { TransactionType } from '@summerfi/sdk-common'
import Link from 'next/link'

import { AccountKitAccountType } from '@/account-kit/types'
import { type GetInterestRatesReturnType } from '@/app/server-handlers/interest-rates'
import { type MigratablePosition } from '@/app/server-handlers/migration'
import { type LatestActivityPagination } from '@/app/server-handlers/tables-data/latest-activity/types'
import { type RebalanceActivityPagination } from '@/app/server-handlers/tables-data/rebalance-activity/types'
import { type TopDepositorsPagination } from '@/app/server-handlers/tables-data/top-depositors/types'
import { detailsLinks } from '@/components/layout/VaultOpenView/vault-details-links'
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
import { useSystemConfig } from '@/contexts/SystemConfigContext/SystemConfigContext'
import { LatestActivity } from '@/features/latest-activity/components/LatestActivity/LatestActivity'
import { MigrationBox } from '@/features/migration/components/MigrationBox/MigrationBox'
import { type MigrationEarningsDataByChainId } from '@/features/migration/types'
import { RebalancingActivity } from '@/features/rebalance-activity/components/RebalancingActivity/RebalancingActivity'
import { VaultExposure } from '@/features/vault-exposure/components/VaultExposure/VaultExposure'
import { getManagementFee } from '@/helpers/get-management-fee'
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
  latestActivity,
  topDepositors,
  viewWalletAddress,
  rebalanceActivity,
  performanceChartData,
  arksHistoricalChartData,
  arksInterestRates,
  vaultApyData,
  migratablePositions,
  migrationBestVaultApy,
}: {
  vault: SDKVaultType | SDKVaultishType
  vaults: SDKVaultsListType
  position: IArmadaPosition
  topDepositors: TopDepositorsPagination
  latestActivity: LatestActivityPagination
  rebalanceActivity: RebalanceActivityPagination
  viewWalletAddress: string
  performanceChartData: PerformanceChartData
  arksHistoricalChartData: ArksHistoricalChartData
  arksInterestRates: GetInterestRatesReturnType
  vaultApyData: VaultApyData
  migratablePositions: MigratablePosition[]
  migrationBestVaultApy: MigrationEarningsDataByChainId
}) => {
  const { getStorageOnce } = useLocalStorageOnce<{
    amount: string
    token: string
  }>({
    key: `${vault.id}-amount`,
  })
  const user = useUser()
  const { userWalletAddress, isLoadingAccount } = useUserWallet()
  const ownerView = viewWalletAddress.toLowerCase() === userWalletAddress?.toLowerCase()
  const { publicClient } = useNetworkAlignedClient()

  const vaultChainId = subgraphNetworkToSDKId(vault.protocol.network)

  const [selectedPosition, setSelectedPosition] = useState<string | undefined>(
    migratablePositions[0]?.id,
  )

  const handleSelectPosition = (id: string) => {
    setSelectedPosition(id)
  }

  const {
    handleTokenSelectionChange,
    setSelectedTokenOption,
    selectedTokenOption,
    tokenOptions,
    baseTokenOptions,
  } = useTokenSelector({
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

  const { features } = useSystemConfig()

  const migrationsEnabled = !!features?.Migrations

  const { deviceType } = useDeviceType()
  const { isMobile, isTablet } = useMobileCheck(deviceType)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const isMobileOrTablet = isMobile || isTablet

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
    publicClient,
  })

  useEffect(() => {
    const savedVaultsListData = getStorageOnce()

    if (savedVaultsListData) {
      const selectedCustomToken = tokenOptions.find(
        (option) => option.value === getDisplayToken(savedVaultsListData.token),
      )

      manualSetAmount(savedVaultsListData.amount)
      if (selectedCustomToken) {
        setSelectedTokenOption(selectedCustomToken)
      }
    }
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
          chainId={vaultChainId}
          transaction={nextTransaction}
          amountParsed={amountParsed}
          amountDisplayUSD={amountDisplayUSDWithSwap}
          transactionFee={transactionFee}
          transactionFeeLoading={transactionFeeLoading}
        />
      ),
      [TransactionType.Withdraw]: (
        <OrderInfoWithdraw
          chainId={vaultChainId}
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
      options={transactionType === TransactionAction.WITHDRAW ? baseTokenOptions : tokenOptions}
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
    handleIsDrawerOpen: (flag: boolean) => setIsDrawerOpen(flag),
    goBackAction: nextTransaction?.type ? backToInit : undefined,
    primaryButton: sidebar.primaryButton,
    footnote: (
      <>
        {!nextTransaction?.type ? (
          <ProjectedEarningsCombined
            vault={vault}
            amountDisplay={amountDisplay}
            estimatedEarnings={estimatedEarnings}
            forecastSummaryMap={forecastSummaryMap}
            isLoadingForecast={isLoadingForecast}
            ownerView={ownerView}
          />
        ) : null}
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
    isMobileOrTablet,
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

  const estimatedSumrPrice = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP

  const managementFee = getManagementFee(vault.inputToken.symbol)

  return (
    <>
      <NonOwnerPositionBanner isOwner={ownerView} walletStateLoaded={!isLoadingAccount} />
      <VaultManageGrid
        vault={vault}
        vaultApyData={vaultApyData}
        vaults={vaults}
        position={position}
        onRefresh={revalidatePositionData}
        viewWalletAddress={viewWalletAddress}
        connectedWalletAddress={user?.address}
        displaySimulationGraph={displaySimulationGraph}
        simulationGraph={
          <VaultSimulationGraph
            isManage
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
                  Forecasted Market Value
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
                The Lazy Summer Protocol is a permissionless passive lending product, which sets out
                to offer effortless and secure optimised yield, while diversifying risk.
              </Text>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  flexWrap: 'wrap',
                  gap: 'var(--general-space-24)',
                  marginTop: 'var(--general-space-20)',
                }}
              >
                {detailsLinks.map(({ label, id }) => (
                  <Link key={label} href={`${getVaultDetailsUrl(vault)}#${id}`}>
                    <Text
                      as="p"
                      variant="p3semi"
                      style={{
                        color: 'var(--color-text-link)',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        paddingRight: 'var(--spacing-space-medium)',
                      }}
                    >
                      <WithArrow>{label}</WithArrow>
                    </Text>
                  </Link>
                ))}
              </div>
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
                  {formatDecimalAsPercent(managementFee)} management fee
                </Text>
                <Text
                  as="p"
                  variant="p2"
                  style={{
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  A {formatDecimalAsPercent(managementFee)} annualised management fee is charged for
                  using this strategy. The fees are continually accounted for and reflected in the
                  market value of your position. This strategy has no other fees, and there are no
                  restrictions or delays when withdrawing.{' '}
                  {vaultApyData.sma30d
                    ? ` The 30d APY for this strategy after fees is ${formatDecimalAsPercent(vaultApyData.sma30d - managementFee)}.`
                    : ''}
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
                rebalanceActivity={rebalanceActivity}
                vaultId={getUniqueVaultId(vault)}
                vault={vault}
              />
            </Expander>
            <Expander
              title={
                <Text as="p" variant="p1semi">
                  User activity
                </Text>
              }
            >
              <LatestActivity
                latestActivity={latestActivity}
                topDepositors={topDepositors}
                vaultId={getUniqueVaultId(vault)}
                page="manage"
                noHighlight
                walletAddress={viewWalletAddress}
              />
            </Expander>
          </div>,
        ]}
        sidebarContent={<Sidebar {...resovledSidebarProps} />}
        rightExtraContent={
          migrationsEnabled &&
          migratablePositions.length > 0 && (
            <MigrationBox
              migratablePositions={migratablePositions}
              selectedPosition={selectedPosition}
              onSelectPosition={handleSelectPosition}
              cta={{
                link: getMigrationLandingPageUrl({
                  walletAddress: viewWalletAddress,
                  selectedPosition,
                }),
                disabled: !selectedPosition,
              }}
              migrationBestVaultApy={migrationBestVaultApy}
            />
          )
        }
        isMobile={isMobile}
      />
    </>
  )
}

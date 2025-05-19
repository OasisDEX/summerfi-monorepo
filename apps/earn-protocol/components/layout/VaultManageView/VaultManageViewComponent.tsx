import { useEffect, useMemo, useState } from 'react'
import { useUser } from '@account-kit/react'
import {
  getDisplayToken,
  getMigrationLandingPageUrl,
  getPositionValues,
  NonOwnerPositionBanner,
  Sidebar,
  SUMR_CAP,
  useAmount,
  useAmountWithSwap,
  useForecast,
  useLocalConfig,
  useLocalStorageOnce,
  useMobileCheck,
  useTokenSelector,
  VaultManageGrid,
} from '@summerfi/app-earn-ui'
import { useTermsOfService } from '@summerfi/app-tos'
import {
  type ArksHistoricalChartData,
  type EarnAppConfigType,
  type GetVaultsApyResponse,
  type IArmadaPosition,
  type PerformanceChartData,
  type SDKVaultishType,
  type SDKVaultsListType,
  type SDKVaultType,
  TOSStatus,
  TransactionAction,
} from '@summerfi/app-types'
import { subgraphNetworkToId, subgraphNetworkToSDKId, zero } from '@summerfi/app-utils'
import { TransactionType } from '@summerfi/sdk-common'

import { AccountKitAccountType } from '@/account-kit/types'
import { type GetInterestRatesReturnType } from '@/app/server-handlers/interest-rates'
import { type MigratablePosition } from '@/app/server-handlers/migration'
import { type LatestActivityPagination } from '@/app/server-handlers/tables-data/latest-activity/types'
import { type RebalanceActivityPagination } from '@/app/server-handlers/tables-data/rebalance-activity/types'
import { type TopDepositorsPagination } from '@/app/server-handlers/tables-data/top-depositors/types'
import { VaultManageViewDetails } from '@/components/layout/VaultManageView/VaultManageViewDetails'
import { VaultSimulationGraph } from '@/components/layout/VaultOpenView/VaultSimulationGraph'
import { TermsOfServiceCookiePrefix, TermsOfServiceVersion } from '@/constants/terms-of-service'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { useSystemConfig } from '@/contexts/SystemConfigContext/SystemConfigContext'
import { MigrationBox } from '@/features/migration/components/MigrationBox/MigrationBox'
import { type MigrationEarningsDataByChainId } from '@/features/migration/types'
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
import { useVaultManageSidebar } from '@/hooks/use-vault-manage-sidebar'

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
  vaultsApyByNetworkMap,
  migratablePositions,
  migrationBestVaultApy,
  systemConfig,
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
  vaultsApyByNetworkMap: GetVaultsApyResponse
  migratablePositions: MigratablePosition[]
  migrationBestVaultApy: MigrationEarningsDataByChainId
  systemConfig: Partial<EarnAppConfigType>
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
  const [sidebarTransactionType, setSidebarTransactionType] = useState<TransactionAction>(
    TransactionAction.DEPOSIT,
  )

  const vaultChainId = subgraphNetworkToSDKId(vault.protocol.network)

  const [selectedPosition, setSelectedPosition] = useState<string | undefined>(
    migratablePositions[0]?.id,
  )

  const vaultApyData =
    vaultsApyByNetworkMap[`${vault.id}-${subgraphNetworkToId(vault.protocol.network)}`] ?? {}

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

  const { netValue, netValueUSD } = getPositionValues({
    position,
    vault,
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
    // withdraw/deposit amount
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
    // approval amount
    tokenDecimals: vault.inputToken.decimals,
    tokenPrice: vault.inputTokenPriceUSD,
    selectedToken,
    initialAmount: amountParsed.toString(),
  })

  const {
    manualSetAmount: switchManualSetAmount,
    amountDisplay: switchAmountDisplay,
    amountParsed: switchAmountParsed,
    onBlur: switchOnBlur,
    onFocus: switchOnFocus,
    resetToInitialAmount: switchResetToInitialAmount,
  } = useAmount({
    // switch amount
    tokenDecimals: vault.inputToken.decimals,
    tokenPrice: vault.inputTokenPriceUSD,
    selectedToken,
    initialAmount: netValue.toString(),
  })

  const transactionAmount = useMemo(() => {
    if (sidebarTransactionType === TransactionAction.SWITCH) {
      return switchAmountParsed
    }

    return amountParsed
  }, [sidebarTransactionType, switchAmountParsed, amountParsed])

  const transactionManualSetAmount = useMemo(() => {
    if (sidebarTransactionType === TransactionAction.SWITCH) {
      return switchManualSetAmount
    }

    return manualSetAmount
  }, [sidebarTransactionType, switchManualSetAmount, manualSetAmount])

  const {
    sidebar,
    reset,
    nextTransaction,
    approvalType,
    approvalTokenSymbol,
    setApprovalType,
    backToInit,
    setSelectedSwitchVault,
    selectedSwitchVault,
    transactions,
    txStatus,
    setIsEditingSwitchAmount,
    isEditingSwitchAmount,
    setSidebarTransactionError,
  } = useTransaction({
    vault,
    vaultChainId,
    amount: transactionAmount,
    manualSetAmount: transactionManualSetAmount,
    publicClient,
    vaultToken,
    token: selectedToken,
    tokenBalance: selectedTokenBalance,
    tokenBalanceLoading: selectedTokenBalanceLoading,
    flow: 'manage',
    ownerView,
    positionAmount: netValue,
    approvalCustomValue: approvalAmountParsed,
    sidebarTransactionType,
    setSidebarTransactionType,
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
    sidebarTransactionType,
    selectedTokenOption,
    sdk,
    slippageConfig,
  })

  const resolvedAmountParsed = getResolvedForecastAmountParsed({
    amountParsed,
    rawToTokenAmount,
  })

  const forecastDisabled = !ownerView || sidebarTransactionType === TransactionAction.SWITCH

  const { isLoadingForecast, oneYearEarningsForecast, forecast, forecastSummaryMap } = useForecast({
    fleetAddress: vault.id,
    chainId: vaultChainId,
    amount: {
      [TransactionAction.DEPOSIT]: resolvedAmountParsed.plus(netValue),
      [TransactionAction.WITHDRAW]: netValue.minus(resolvedAmountParsed).lt(zero)
        ? zero
        : netValue.minus(resolvedAmountParsed),
      [TransactionAction.SWITCH]: zero,
    }[sidebarTransactionType].toString(),
    disabled: forecastDisabled,
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

  const vaultManageSidebar = useVaultManageSidebar({
    sidebarTransactionType,
    vaults,
    vault,
    vaultChainId,
    vaultsApyByNetworkMap,
    systemConfig,
    netValueUSD,
    transactions,
    nextTransaction,
    txStatus,
    selectedSwitchVault,
    setSidebarTransactionType,
    setSidebarTransactionError,
    transactionSidebarData: sidebar,
    amountParsed,
    amountDisplay,
    switchAmountDisplay,
    amountDisplayUSDWithSwap,
    transactionReset: reset,
    position,
    setSelectedSwitchVault,
    handleAmountChange,
    handleTokenSelectionChange,
    baseTokenOptions,
    tokenOptions,
    selectedTokenOption,
    onFocus,
    approvalOnFocus,
    switchOnFocus,
    onBlur,
    approvalOnBlur,
    switchOnBlur,
    ownerView,
    selectedTokenBalance,
    netValue,
    selectedTokenBalanceLoading,
    manualSetAmount,
    approvalManualSetAmount,
    switchManualSetAmount,
    transactionFee,
    transactionFeeLoading,
    switchResetToInitialAmount,
    isEditingSwitchAmount,
    setIsEditingSwitchAmount,
    approvalTokenSymbol,
    approvalType,
    setApprovalType,
    approvalHandleAmountChange,
    approvalCustomAmount,
    isDrawerOpen,
    setIsDrawerOpen,
    isMobile,
    backToInit,
    estimatedEarnings,
    forecastSummaryMap,
    isLoadingForecast,
    isMobileOrTablet,
  })

  const nextTransactionType = nextTransaction?.type

  const resovledSidebarProps = useMemo(() => {
    return tosState.status !== TOSStatus.DONE &&
      nextTransactionType &&
      [TransactionType.Approve, TransactionType.Deposit, TransactionType.Withdraw].includes(
        nextTransactionType,
      )
      ? tosSidebarProps
      : vaultManageSidebar.sidebarProps
  }, [nextTransactionType, tosSidebarProps, tosState.status, vaultManageSidebar.sidebarProps])

  const estimatedSumrPrice = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP

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
          !forecastDisabled && (
            <VaultSimulationGraph
              isManage
              vault={vault}
              forecast={forecast}
              isLoadingForecast={isLoadingForecast}
              amount={amountParsed}
            />
          )
        }
        sumrPrice={estimatedSumrPrice}
        detailsContent={
          <VaultManageViewDetails
            arksHistoricalChartData={arksHistoricalChartData}
            performanceChartData={performanceChartData}
            arksInterestRates={arksInterestRates}
            vaultApyData={vaultApyData}
            vault={vault}
            rebalanceActivity={rebalanceActivity}
            latestActivity={latestActivity}
            topDepositors={topDepositors}
            viewWalletAddress={viewWalletAddress}
          />
        }
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

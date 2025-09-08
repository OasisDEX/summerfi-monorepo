import { useCallback, useEffect, useMemo, useState } from 'react'
import { useUser } from '@account-kit/react'
import {
  Card,
  ControlsDepositWithdraw,
  ControlsSwitch,
  getDisplayToken,
  getMigrationLandingPageUrl,
  getPositionValues,
  Icon,
  NonOwnerPositionBanner,
  ProjectedEarningsCombined,
  Sidebar,
  SidebarFootnote,
  sidebarFootnote,
  SidebarMobileHeader,
  type SidebarProps,
  SkeletonLine,
  SUMR_CAP,
  Text,
  useAmount,
  useAmountWithSwap,
  useForecast,
  useIsIframe,
  useLocalConfig,
  useLocalStorageOnce,
  useMobileCheck,
  useTokenSelector,
  useUserWallet,
  VaultManageGrid,
} from '@summerfi/app-earn-ui'
import { useTermsOfService } from '@summerfi/app-tos'
import {
  type ArksHistoricalChartData,
  type DropdownRawOption,
  type EarnAppConfigType,
  type GetVaultsApyResponse,
  type IArmadaPosition,
  type IArmadaVaultInfo,
  type InterestRates,
  type NetworkIds,
  type PerformanceChartData,
  type SDKVaultishType,
  type SDKVaultsListType,
  type SDKVaultType,
  TOSStatus,
  TransactionAction,
} from '@summerfi/app-types'
import {
  subgraphNetworkToId,
  subgraphNetworkToSDKId,
  supportedSDKNetwork,
  zero,
} from '@summerfi/app-utils'
import { TransactionType } from '@summerfi/sdk-common'
import dynamic from 'next/dynamic'

import { type MigratablePosition } from '@/app/server-handlers/migration'
import { type LatestActivityPagination } from '@/app/server-handlers/tables-data/latest-activity/types'
import { type RebalanceActivityPagination } from '@/app/server-handlers/tables-data/rebalance-activity/types'
import { type TopDepositorsPagination } from '@/app/server-handlers/tables-data/top-depositors/types'
import { RebalancingNoticeBanner } from '@/components/layout/RebalancingNoticeBanner/RebalancingNoticeBanner'
import { VaultManageViewDetails } from '@/components/layout/VaultManageView/VaultManageViewDetails'
import { VaultSimulationGraph } from '@/components/layout/VaultOpenView/VaultSimulationGraph'
import { PendingTransactionsList } from '@/components/molecules/PendingTransactionsList/PendingTransactionsList'
import { TermsOfServiceCookiePrefix, TermsOfServiceVersion } from '@/constants/terms-of-service'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { useSystemConfig } from '@/contexts/SystemConfigContext/SystemConfigContext'
import { MigrationBox } from '@/features/migration/components/MigrationBox/MigrationBox'
import { type MigrationEarningsDataByChainId } from '@/features/migration/types'
import { UnstakeVaultToken } from '@/features/unstake-vault-token/components/UnstakeVaultToken/UnstakeVaultToken'
import { getResolvedForecastAmountParsed } from '@/helpers/get-resolved-forecast-amount-parsed'
import { revalidatePositionData } from '@/helpers/revalidation-handlers'
import { useAppSDK } from '@/hooks/use-app-sdk'
import { useGasEstimation } from '@/hooks/use-gas-estimation'
import { useNetworkAlignedClient } from '@/hooks/use-network-aligned-client'
import { useTermsOfServiceSidebar } from '@/hooks/use-terms-of-service-sidebar'
import { useTermsOfServiceSigner } from '@/hooks/use-terms-of-service-signer'
import { useTokenBalance } from '@/hooks/use-token-balance'
import { useTransaction } from '@/hooks/use-transaction'

const ControlsApproval = dynamic(
  () =>
    import('@/components/molecules/SidebarElements/ControlsApproval').then(
      (mod) => mod.ControlsApproval,
    ),
  { ssr: false, loading: () => <SkeletonLine width="100%" height="100%" /> },
)

const ControlsSwitchTransactionView = dynamic(
  () =>
    import('@/components/molecules/SidebarElements/ControlsSwitchTransactionView').then(
      (mod) => mod.ControlsSwitchTransactionView,
    ),
  { ssr: false, loading: () => <SkeletonLine width="100%" height="100%" /> },
)

const ControlsSwitchSuccessErrorView = dynamic(
  () =>
    import('@/components/molecules/SidebarElements/ControlsSwitchSuccessErrorView').then(
      (mod) => mod.ControlsSwitchSuccessErrorView,
    ),
  { ssr: false, loading: () => <SkeletonLine width="100%" height="100%" /> },
)

const OrderInfoDeposit = dynamic(
  () =>
    import('@/components/molecules/SidebarElements/OrderInfoDeposit').then(
      (mod) => mod.OrderInfoDeposit,
    ),
  { ssr: false, loading: () => <SkeletonLine width="100%" height="100%" /> },
)

const OrderInfoWithdraw = dynamic(
  () =>
    import('@/components/molecules/SidebarElements/OrderInfoWithdraw').then(
      (mod) => mod.OrderInfoWithdraw,
    ),
  { ssr: false, loading: () => <SkeletonLine width="100%" height="100%" /> },
)

export const VaultManageViewComponent = ({
  vault,
  vaults,
  vaultInfo,
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
  vaultInfo?: IArmadaVaultInfo
  topDepositors: TopDepositorsPagination
  latestActivity: LatestActivityPagination
  rebalanceActivity: RebalanceActivityPagination
  viewWalletAddress: string
  performanceChartData: PerformanceChartData
  arksHistoricalChartData: ArksHistoricalChartData
  arksInterestRates: InterestRates
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

  const vaultChainId = subgraphNetworkToSDKId(supportedSDKNetwork(vault.protocol.network))

  const [selectedPosition, setSelectedPosition] = useState<string | undefined>(
    migratablePositions[0]?.id,
  )

  const vaultApyData =
    vaultsApyByNetworkMap[
      `${vault.id}-${subgraphNetworkToId(supportedSDKNetwork(vault.protocol.network))}`
    ] ?? {}

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
    handleSetTokenBalanceLoading,
  } = useTokenBalance({
    publicClient,
    vaultTokenSymbol: vault.inputToken.symbol,
    tokenSymbol: selectedTokenOption.value,
    chainId: vaultChainId,
  })

  // wrapper to show skeleton immediately when changing token
  const handleTokenSelectionChangeWrapper = useCallback(
    (option: DropdownRawOption) => {
      handleTokenSelectionChange(option)
      handleSetTokenBalanceLoading(true)
    },
    [handleTokenSelectionChange, handleSetTokenBalanceLoading],
  )

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
  const isIframe = useIsIframe()

  const tosState = useTermsOfService({
    publicClient,
    signMessage: signTosMessage,
    chainId: vaultChainId,
    walletAddress: user?.address,
    version: TermsOfServiceVersion.APP_VERSION,
    cookiePrefix: TermsOfServiceCookiePrefix.APP_TOKEN,
    host: '/earn',
    type: 'default',
    isIframe,
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

  const potentialVaultsToSwitchTo = useMemo(() => {
    return vaults
      .filter((potentialVault) => {
        return (
          subgraphNetworkToSDKId(supportedSDKNetwork(potentialVault.protocol.network)) ===
            vaultChainId && potentialVault.id !== vault.id
        )
      })
      .sort((a, b) => {
        const vaultApyA = vaultsApyByNetworkMap[`${a.id}-${vaultChainId}`]
        const vaultApyB = vaultsApyByNetworkMap[`${b.id}-${vaultChainId}`]

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!vaultApyA || !vaultApyB) {
          return 0
        }

        return vaultApyB.apy - vaultApyA.apy
      })
  }, [vault.id, vaultChainId, vaults, vaultsApyByNetworkMap])

  const potentialVaultsToSwitchToTokens = useMemo(() => {
    return [
      ...new Set(
        potentialVaultsToSwitchTo.map((aultsToSwitchTo) => aultsToSwitchTo.inputToken.symbol),
      ),
    ].sort()
  }, [potentialVaultsToSwitchTo])

  const considerSwitchingContent = useMemo(() => {
    return potentialVaultsToSwitchToTokens.length > 0 &&
      sidebarTransactionType === TransactionAction.WITHDRAW ? (
      <Card onClick={() => setSidebarTransactionType(TransactionAction.SWITCH)}>
        <Text variant="p4semi" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <Icon iconName="summer_illustration_switch" style={{ marginRight: '8px' }} />
          Consider switching to another vault: {potentialVaultsToSwitchToTokens.join(', ')}
        </Text>
      </Card>
    ) : null
  }, [potentialVaultsToSwitchToTokens, sidebarTransactionType])

  const sidebarTabsList = useMemo(() => {
    return [TransactionAction.DEPOSIT, TransactionAction.WITHDRAW, TransactionAction.SWITCH].filter(
      (action) => {
        const disabledByConfig = !systemConfig.features?.VaultSwitching
        const noVaults = potentialVaultsToSwitchTo.length === 0

        if (disabledByConfig || noVaults || netValueUSD.lt(0.1)) {
          return action !== TransactionAction.SWITCH
        }

        return true
      },
    )
  }, [netValueUSD, potentialVaultsToSwitchTo.length, systemConfig.features?.VaultSwitching])

  const isSwitch = sidebarTransactionType === TransactionAction.SWITCH
  const isDeposit = sidebarTransactionType === TransactionAction.DEPOSIT
  const isWithdraw = sidebarTransactionType === TransactionAction.WITHDRAW
  const isDepositOrWithdraw = isDeposit || isWithdraw

  const sidebarContent = useMemo(() => {
    // TODO: this hook needs a rework after vault switching is done
    // trying to make this simple - if there is no next transaction, we are in the entry points
    // also adding a fail safe for the mapping missing here at the end
    if (!nextTransaction) {
      if (isSwitch) {
        if (txStatus === 'txSuccess' && selectedSwitchVault) {
          // a success screen specially for the switch action
          return (
            <ControlsSwitchSuccessErrorView
              currentVault={vault}
              selectedSwitchVault={selectedSwitchVault}
              vaultsList={potentialVaultsToSwitchTo}
              transactions={transactions}
              chainId={vaultChainId as unknown as NetworkIds}
            />
          )
        }

        return (
          <ControlsSwitch
            currentPosition={position}
            currentVault={vault}
            potentialVaults={potentialVaultsToSwitchTo}
            chainId={vaultChainId as unknown as NetworkIds}
            vaultsApyByNetworkMap={vaultsApyByNetworkMap}
            selectVault={setSelectedSwitchVault}
            selectedVault={selectedSwitchVault}
          />
        )
      } else if (isDepositOrWithdraw) {
        return (
          <ControlsDepositWithdraw
            amountDisplay={amountDisplay}
            amountDisplayUSD={amountDisplayUSDWithSwap}
            handleAmountChange={handleAmountChange}
            handleDropdownChange={handleTokenSelectionChangeWrapper}
            transactionType={sidebarTransactionType}
            options={
              sidebarTransactionType === TransactionAction.WITHDRAW
                ? baseTokenOptions
                : tokenOptions
            }
            dropdownValue={selectedTokenOption}
            onFocus={onFocus}
            onBlur={onBlur}
            ownerView={ownerView}
            tokenSymbol={
              sidebarTransactionType === TransactionAction.DEPOSIT
                ? selectedTokenOption.value
                : getDisplayToken(vault.inputToken.symbol)
            }
            tokenBalance={
              sidebarTransactionType === TransactionAction.DEPOSIT
                ? selectedTokenBalance
                : ownerView
                  ? netValue
                  : undefined
            }
            tokenBalanceLoading={selectedTokenBalanceLoading}
            manualSetAmount={manualSetAmount}
            contentAfterInput={considerSwitchingContent}
          />
        )
      } else {
        return <div>Sidebar TX type not supported</div>
      }
    }
    if (isSwitch && selectedSwitchVault) {
      return (
        <ControlsSwitchTransactionView
          currentVault={vault}
          currentVaultNetValue={netValue}
          vaultsList={potentialVaultsToSwitchTo}
          selectedSwitchVault={selectedSwitchVault}
          vaultsApyByNetworkMap={vaultsApyByNetworkMap}
          transactions={transactions}
          switchingAmount={switchAmountDisplay}
          setSwitchingAmount={switchManualSetAmount}
          isLoading={sidebar.primaryButton.loading}
          switchingAmountOnBlur={switchOnBlur}
          switchingAmountOnFocus={switchOnFocus}
          transactionFee={transactionFee}
          transactionFeeLoading={transactionFeeLoading}
          resetToInitialAmount={switchResetToInitialAmount}
          isEditingSwitchAmount={isEditingSwitchAmount}
          setIsEditingSwitchAmount={setIsEditingSwitchAmount}
        />
      )
    }
    if (nextTransaction.type === TransactionType.Approve) {
      return (
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
          sidebarTransactionType={sidebarTransactionType}
        />
      )
    } else if (nextTransaction.type === TransactionType.Deposit) {
      return (
        <OrderInfoDeposit
          chainId={vaultChainId}
          transaction={nextTransaction}
          amountParsed={amountParsed}
          amountDisplayUSD={amountDisplayUSDWithSwap}
          transactionFee={transactionFee}
          transactionFeeLoading={transactionFeeLoading}
        />
      )
    } else if (nextTransaction.type === TransactionType.Withdraw) {
      return (
        <OrderInfoWithdraw
          chainId={vaultChainId}
          transaction={nextTransaction}
          amountParsed={amountParsed}
          amountDisplayUSD={amountDisplayUSDWithSwap}
          transactionFee={transactionFee}
          transactionFeeLoading={transactionFeeLoading}
        />
      )
    } else {
      // this is a fail safe for the mapping missing here at the end
      // we should never get here
      return <div>Transaction type ({nextTransaction.type}) not supported</div>
    }
  }, [
    amountDisplay,
    amountDisplayUSDWithSwap,
    amountParsed,
    approvalCustomAmount,
    approvalHandleAmountChange,
    approvalManualSetAmount,
    approvalOnBlur,
    approvalOnFocus,
    approvalTokenSymbol,
    approvalType,
    baseTokenOptions,
    considerSwitchingContent,
    handleAmountChange,
    handleTokenSelectionChangeWrapper,
    isDepositOrWithdraw,
    isEditingSwitchAmount,
    isSwitch,
    manualSetAmount,
    netValue,
    nextTransaction,
    onBlur,
    onFocus,
    ownerView,
    position,
    potentialVaultsToSwitchTo,
    selectedSwitchVault,
    selectedTokenBalance,
    selectedTokenBalanceLoading,
    selectedTokenOption,
    setApprovalType,
    setIsEditingSwitchAmount,
    setSelectedSwitchVault,
    sidebar.primaryButton.loading,
    sidebarTransactionType,
    switchAmountDisplay,
    switchManualSetAmount,
    switchOnBlur,
    switchOnFocus,
    switchResetToInitialAmount,
    tokenOptions,
    transactionFee,
    transactionFeeLoading,
    transactions,
    txStatus,
    vault,
    vaultChainId,
    vaultsApyByNetworkMap,
  ])

  const sidebarTitle = useMemo(() => {
    if (!nextTransaction) {
      if (isSwitch && txStatus === 'txSuccess') {
        return sidebar.title
      }

      return sidebarTransactionType
    }

    return sidebar.title
  }, [isSwitch, nextTransaction, sidebar.title, sidebarTransactionType, txStatus])

  const sidebarTitleTabs = useMemo(() => {
    if (!nextTransaction) {
      if (isSwitch && txStatus === 'txSuccess') {
        return undefined
      }

      return sidebarTabsList
    }

    return undefined
  }, [nextTransaction, sidebarTabsList, isSwitch, txStatus])

  const sidebarProps: SidebarProps = {
    title: sidebarTitle,
    titleTabs: sidebarTitleTabs,
    onTitleTabChange: (action) => {
      setSidebarTransactionType(action as TransactionAction)
      setSidebarTransactionError(undefined)
      if (amountParsed.gt(0)) {
        reset()
      }
    },
    content: (
      <>
        {sidebarContent}
        <PendingTransactionsList transactions={transactions} chainId={vaultChainId} />
      </>
    ),
    customHeader:
      !isDrawerOpen && isMobile ? (
        <SidebarMobileHeader
          type="manage"
          sidebarTransactionType={sidebarTransactionType}
          setSidebarTransactionType={setSidebarTransactionType}
        />
      ) : undefined,
    handleIsDrawerOpen: (flag: boolean) => setIsDrawerOpen(flag),
    goBackAction: nextTransaction?.type ? backToInit : undefined,
    primaryButton: sidebar.primaryButton,
    secondaryButton: sidebar.secondaryButton,
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

  return (
    <>
      <NonOwnerPositionBanner isOwner={ownerView} walletStateLoaded={!isLoadingAccount} />
      <RebalancingNoticeBanner vault={vault} />
      <VaultManageGrid
        vault={vault}
        vaultInfo={vaultInfo}
        vaultApyData={vaultApyData}
        vaults={vaults}
        position={position}
        onRefresh={revalidatePositionData}
        viewWalletAddress={viewWalletAddress}
        connectedWalletAddress={userWalletAddress}
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
          <>
            {migrationsEnabled && migratablePositions.length > 0 && (
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
            )}
            <UnstakeVaultToken vault={vault} walletAddress={viewWalletAddress} />
          </>
        }
        isMobile={isMobile}
      />
    </>
  )
}

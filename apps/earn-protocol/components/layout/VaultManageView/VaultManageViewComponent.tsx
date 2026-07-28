import { useCallback, useEffect, useMemo } from 'react'
import {
  ControlsDepositWithdraw,
  getDisplayToken,
  getPositionValues,
  NonOwnerPositionBanner,
  ProjectedEarningsCombined,
  Sidebar,
  SidebarFootnote,
  sidebarFootnote,
  type SidebarProps,
  SkeletonLine,
  useAmount,
  useAmountWithSwap,
  useEarnProtocolWallet,
  useForecast,
  useIsIframe,
  useLocalConfig,
  useLocalStorageOnce,
  useMobileCheck,
  useTokenSelector,
  VaultManageGrid,
} from '@summerfi/app-earn-ui'
import { useTermsOfService } from '@summerfi/app-tos'
import {
  type DropdownRawOption,
  type EarnAppConfigType,
  type GetVaultsApyResponse,
  type IArmadaPosition,
  type IArmadaVaultInfo,
  type RewardTokenPrices,
  type SDKVaultishType,
  type SDKVaultsListType,
  type SDKVaultType,
  type SupportedSDKNetworks,
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

import { ArbitrumNoticeBanner } from '@/components/layout/ArbitrumNoticeBanner/ArbitrumNoticeBanner'
import { RebalancingNoticeBanner } from '@/components/layout/RebalancingNoticeBanner/RebalancingNoticeBanner'
import { RewardTokenClaimBox } from '@/components/layout/VaultManageView/RewardTokenClaimBox'
import { VaultManageViewDetails } from '@/components/layout/VaultManageView/VaultManageViewDetails'
import { VaultSimulationGraph } from '@/components/layout/VaultOpenView/VaultSimulationGraph'
import { PendingTransactionsList } from '@/components/molecules/PendingTransactionsList/PendingTransactionsList'
import { TermsOfServiceCookiePrefix, TermsOfServiceVersion } from '@/constants/terms-of-service'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { UnstakeVaultToken } from '@/features/unstake-vault-token/components/UnstakeVaultToken/UnstakeVaultToken'
import { getResolvedForecastAmountParsed } from '@/helpers/get-resolved-forecast-amount-parsed'
import { useAppSDK } from '@/hooks/use-app-sdk'
import { useGasEstimation } from '@/hooks/use-gas-estimation'
import { useNetworkAlignedClient } from '@/hooks/use-network-aligned-client'
import { useRevalidatePositionData } from '@/hooks/use-revalidate'
import { useTermsOfServiceSidebar } from '@/hooks/use-terms-of-service-sidebar'
import { useTermsOfServiceSigner } from '@/hooks/use-terms-of-service-signer'
import { useTokenBalance } from '@/hooks/use-token-balance'
import { useTransaction } from '@/hooks/use-transactions-with-cow'

const ControlsApproval = dynamic(
  () =>
    import('@/components/molecules/SidebarElements/ControlsApproval').then(
      (mod) => mod.ControlsApproval,
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
  network,
  vaultId,
  vault,
  vaults,
  vaultInfo,
  noOfDeposits,
  position,
  viewWalletAddress,
  vaultsApyByNetworkMap,
  rewardTokenPrices,
  rewardTokensClaimableNow,
}: {
  network: SupportedSDKNetworks
  vaultId: string
  vault: SDKVaultType | SDKVaultishType
  vaults: SDKVaultsListType
  position: IArmadaPosition
  vaultInfo?: IArmadaVaultInfo
  noOfDeposits: number
  viewWalletAddress: string
  vaultsApyByNetworkMap: GetVaultsApyResponse
  systemConfig?: Partial<EarnAppConfigType>
  rewardTokenPrices: RewardTokenPrices
  rewardTokensClaimableNow: {
    [tokenSymbol: string]: {
      amount: number
      tokenAddress: string
    }
  }
}) => {
  const { getStorageOnce } = useLocalStorageOnce<{
    amount: string
    token: string
  }>({
    key: `${vault.id}-amount`,
  })
  const { address: userWalletAddress, isLoadingAccount } = useEarnProtocolWallet()
  const ownerView = viewWalletAddress.toLowerCase() === userWalletAddress?.toLowerCase()
  const { publicClient } = useNetworkAlignedClient()
  const sidebarTransactionType = TransactionAction.WITHDRAW
  const revalidatePositionData = useRevalidatePositionData()

  const vaultChainId = subgraphNetworkToSDKId(supportedSDKNetwork(vault.protocol.network))

  const vaultApyData =
    vaultsApyByNetworkMap[
      `${vault.id}-${subgraphNetworkToId(supportedSDKNetwork(vault.protocol.network))}`
    ] ?? {}

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

  const { netValue } = getPositionValues({
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
    // withdraw amount
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
    sidebar,
    nextTransaction,
    approvalType,
    approvalTokenSymbol,
    setApprovalType,
    backToInit,
    transactions,
  } = useTransaction({
    vault,
    vaultChainId,
    amount: amountParsed,
    manualSetAmount,
    publicClient,
    vaultToken,
    token: selectedToken,
    flow: 'manage',
    ownerView,
    positionAmount: netValue,
    approvalCustomValue: approvalAmountParsed,
    sidebarTransactionType,
    setSidebarTransactionType: () => null,
  })

  const sdk = useAppSDK()

  const {
    state: { slippageConfig },
  } = useLocalConfig()

  const { deviceType } = useDeviceType()
  const { isMobile, isTablet } = useMobileCheck(deviceType)

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

  const forecastDisabled = !ownerView

  const { isLoadingForecast, oneYearEarningsForecast, forecast, forecastSummaryMap } = useForecast({
    fleetAddress: vault.id,
    chainId: vaultChainId,
    amount: netValue.minus(resolvedAmountParsed).lt(zero)
      ? zero.toString()
      : netValue.minus(resolvedAmountParsed).toString(),
    disabled: forecastDisabled,
    isEarnApp: true,
  })

  const signTosMessage = useTermsOfServiceSigner()
  const isIframe = useIsIframe()

  const tosState = useTermsOfService({
    publicClient,
    signMessage: signTosMessage,
    chainId: vaultChainId,
    walletAddress: userWalletAddress,
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
    walletAddress: userWalletAddress,
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

  const sidebarContent = useMemo(() => {
    if (!nextTransaction) {
      return (
        <ControlsDepositWithdraw
          amountDisplay={amountDisplay}
          amountDisplayUSD={amountDisplayUSDWithSwap}
          handleAmountChange={handleAmountChange}
          handleDropdownChange={handleTokenSelectionChangeWrapper}
          transactionType={sidebarTransactionType}
          options={baseTokenOptions}
          dropdownValue={selectedTokenOption}
          onFocus={onFocus}
          onBlur={onBlur}
          ownerView={ownerView}
          tokenSymbol={getDisplayToken(vault.inputToken.symbol)}
          tokenBalance={ownerView ? netValue : undefined}
          tokenBalanceLoading={selectedTokenBalanceLoading}
          manualSetAmount={manualSetAmount}
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
      return <div>Transaction type ({nextTransaction.type}) not supported</div>
    }
  }, [
    nextTransaction,
    amountDisplay,
    amountDisplayUSDWithSwap,
    handleAmountChange,
    handleTokenSelectionChangeWrapper,
    sidebarTransactionType,
    baseTokenOptions,
    selectedTokenOption,
    onFocus,
    onBlur,
    ownerView,
    vault.inputToken.symbol,
    netValue,
    selectedTokenBalanceLoading,
    manualSetAmount,
    approvalTokenSymbol,
    approvalType,
    setApprovalType,
    approvalHandleAmountChange,
    approvalCustomAmount,
    approvalManualSetAmount,
    approvalOnBlur,
    approvalOnFocus,
    selectedTokenBalance,
    vaultChainId,
    amountParsed,
    transactionFee,
    transactionFeeLoading,
  ])

  const sidebarProps: SidebarProps = {
    title: sidebar.title,
    content: (
      <>
        {sidebarContent}
        <PendingTransactionsList transactions={transactions} chainId={vaultChainId} />
      </>
    ),
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
    [TransactionType.Approve, TransactionType.Withdraw].includes(nextTransactionType)
      ? tosSidebarProps
      : sidebarProps

  return (
    <>
      <NonOwnerPositionBanner isOwner={ownerView} walletStateLoaded={!isLoadingAccount} />
      <RebalancingNoticeBanner vault={vault} />
      <ArbitrumNoticeBanner vault={vault} />
      <VaultManageGrid
        vault={vault}
        vaultInfo={vaultInfo}
        rewardTokenPrices={rewardTokenPrices}
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
        detailsContent={
          <VaultManageViewDetails
            network={network}
            vaultId={vaultId}
            viewWalletAddress={viewWalletAddress}
            vault={vault}
            vaultApyData={vaultApyData}
          />
        }
        sidebarContent={<Sidebar {...resovledSidebarProps} />}
        rightExtraContent={
          <>
            <RewardTokenClaimBox
              vaultChainId={vaultChainId}
              rewardTokensClaimableNow={rewardTokensClaimableNow}
              rewardTokenPrices={rewardTokenPrices}
              viewWalletAddress={viewWalletAddress}
            />
            <UnstakeVaultToken vault={vault} walletAddress={viewWalletAddress} />
          </>
        }
        isMobile={isMobile}
        noOfDeposits={noOfDeposits}
      />
    </>
  )
}

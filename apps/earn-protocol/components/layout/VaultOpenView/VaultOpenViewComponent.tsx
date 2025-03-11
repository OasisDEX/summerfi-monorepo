import { useEffect, useMemo, useState } from 'react'
import {
  ControlsDepositWithdraw,
  getDisplayToken,
  getMigrationLandingPageUrl,
  Sidebar,
  SidebarFootnote,
  sidebarFootnote,
  SidebarMobileHeader,
  type SidebarProps,
  SUMR_CAP,
  useAmount,
  useAmountWithSwap,
  useForecast,
  useLocalConfig,
  useLocalStorageOnce,
  useMobileCheck,
  useTokenSelector,
  VaultOpenGrid,
} from '@summerfi/app-earn-ui'
import { useTermsOfService } from '@summerfi/app-tos'
import {
  type ArksHistoricalChartData,
  sdkSupportedChains,
  type SDKUsersActivityType,
  type SDKVaultishType,
  type SDKVaultsListType,
  type SDKVaultType,
  TOSStatus,
  TransactionAction,
  type UsersActivity,
} from '@summerfi/app-types'
import { subgraphNetworkToSDKId } from '@summerfi/app-utils'
import { getChainInfoByChainId, type IToken, TransactionType } from '@summerfi/sdk-common'

import { AccountKitAccountType } from '@/account-kit/types'
import { type MigratablePosition } from '@/app/server-handlers/migration'
import { type GetVaultsApyResponse } from '@/app/server-handlers/vaults-apy'
import { VaultSimulationGraph } from '@/components/layout/VaultOpenView/VaultSimulationGraph'
import { ControlsApproval, OrderInfoDeposit } from '@/components/molecules/SidebarElements'
import { TransactionHashPill } from '@/components/molecules/TransactionHashPill/TransactionHashPill'
import { TermsOfServiceCookiePrefix, TermsOfServiceVersion } from '@/constants/terms-of-service'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { useSystemConfig } from '@/contexts/SystemConfigContext/SystemConfigContext'
import { MigrationBox } from '@/features/migration/components/MigrationBox/MigrationBox'
import { getMigrationBestVaultApy } from '@/features/migration/helpers/get-migration-best-vault-apy'
import { mapMigrationResponse } from '@/features/migration/helpers/map-migration-response'
import { type MigrationEarningsDataByChainId } from '@/features/migration/types'
import { TransakWidget } from '@/features/transak/components/TransakWidget/TransakWidget'
import { getResolvedForecastAmountParsed } from '@/helpers/get-resolved-forecast-amount-parsed'
import { revalidatePositionData } from '@/helpers/revalidation-handlers'
import { useAppSDK } from '@/hooks/use-app-sdk'
import { useGasEstimation } from '@/hooks/use-gas-estimation'
import { useNetworkAlignedClient } from '@/hooks/use-network-aligned-client'
import { usePosition } from '@/hooks/use-position'
import { useRedirectToPositionView } from '@/hooks/use-redirect-to-position'
import { useTermsOfServiceSidebar } from '@/hooks/use-terms-of-service-sidebar'
import { useTermsOfServiceSigner } from '@/hooks/use-terms-of-service-signer'
import { useTokenBalance } from '@/hooks/use-token-balance'
import { useTransaction } from '@/hooks/use-transaction'
import { useUserWallet } from '@/hooks/use-user-wallet'

import { VaultOpenViewDetails } from './VaultOpenViewDetails'

type VaultOpenViewComponentProps = {
  vault: SDKVaultType | SDKVaultishType
  vaults: SDKVaultsListType
  userActivity: UsersActivity
  topDepositors: SDKUsersActivityType
  medianDefiYield?: number
  arksHistoricalChartData: ArksHistoricalChartData
  arksInterestRates?: { [key: string]: number }
  vaultApy?: number
  vaultsApyRaw: GetVaultsApyResponse
}

export const VaultOpenViewComponent = ({
  vault,
  vaults,
  userActivity,
  topDepositors,
  medianDefiYield,
  arksHistoricalChartData,
  arksInterestRates,
  vaultApy,
  vaultsApyRaw,
}: VaultOpenViewComponentProps) => {
  const { getStorageOnce } = useLocalStorageOnce<string>({
    key: `${vault.id}-amount`,
  })
  const { publicClient } = useNetworkAlignedClient()
  const { deviceType } = useDeviceType()
  const { isMobileOrTablet } = useMobileCheck(deviceType)

  const { features } = useSystemConfig()

  const migrationsEnabled = !!features?.Migrations

  const { userWalletAddress } = useUserWallet()

  const vaultChainId = subgraphNetworkToSDKId(vault.protocol.network)

  const {
    state: { sumrNetApyConfig, slippageConfig },
  } = useLocalConfig()
  const sdk = useAppSDK()

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [migratablePositions, setMigratablePositions] = useState<MigratablePosition[]>([])
  const [migrationBestVaultApy, setMigrationBestVaultApy] =
    useState<MigrationEarningsDataByChainId>()

  useEffect(() => {
    const fetchMigratablePositions = async (walletAddress: string) => {
      const promises = sdkSupportedChains.map((chainId) => {
        const chainInfo = getChainInfoByChainId(chainId)

        return sdk.getMigratablePositions({ walletAddress, chainInfo })
      })

      const positions = await Promise.all(promises)

      const mappedPositions = mapMigrationResponse(positions)

      const mappedBestVaultApy = getMigrationBestVaultApy({
        migratablePositions: mappedPositions,
        vaultsWithConfig: vaults,
        vaultsApyByNetworkMap: vaultsApyRaw,
      })

      setMigratablePositions(mappedPositions)
      setMigrationBestVaultApy(mappedBestVaultApy)
    }

    if (userWalletAddress) {
      fetchMigratablePositions(userWalletAddress)
    }
  }, [userWalletAddress, sdk, vaults, vaultsApyRaw])

  const [selectedPosition, setSelectedPosition] = useState<string | undefined>(
    migratablePositions[0]?.id,
  )

  const handleSelectPosition = (id: string) => {
    setSelectedPosition(id)
  }

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
  } = useAmount({
    tokenDecimals: vault.inputToken.decimals,
    tokenPrice: vault.inputTokenPriceUSD,
    selectedToken:
      selectedToken ??
      ({
        // if youre not connected, the selected token is not available
        // we need to fill it here
        decimals: vault.inputToken.decimals,
      } as IToken),
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
  })

  const {
    approvalType,
    approvalTokenSymbol,
    setApprovalType,
    sidebar,
    txHashes,
    removeTxHash,
    nextTransaction,
    backToInit,
    user,
    isTransakOpen,
    setIsTransakOpen,
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
    flow: 'open',
    ownerView: true,
    approvalCustomValue: approvalAmountParsed,
  })

  const { position } = usePosition({
    chainId: vaultChainId,
    vaultId: vault.id,
  })

  const { amountDisplayUSDWithSwap, rawToTokenAmount } = useAmountWithSwap({
    vault,
    vaultChainId,
    amountDisplay,
    amountDisplayUSD,
    transactionType: TransactionAction.DEPOSIT,
    selectedTokenOption,
    sdk,
    slippageConfig,
  })

  const resolvedAmountParsed = getResolvedForecastAmountParsed({
    amountParsed,
    rawToTokenAmount,
  })

  const { forecast, isLoadingForecast, oneYearEarningsForecast } = useForecast({
    fleetAddress: vault.id,
    chainId: vaultChainId,
    amount: resolvedAmountParsed.toString(),
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

  useEffect(() => {
    const savedAmount = getStorageOnce()

    if (savedAmount) {
      manualSetAmount(savedAmount)
    }
  })
  useRedirectToPositionView({ vault, position })

  const displaySimulationGraph = amountParsed.gt(0)

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
      [TransactionType.Withdraw]: null, // just for types, withdraw doesn't happen on open view
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
      tokenSymbol={selectedTokenOption.value}
      tokenBalance={selectedTokenBalance}
      tokenBalanceLoading={selectedTokenBalanceLoading}
      manualSetAmount={manualSetAmount}
      vault={vault}
      estimatedEarnings={estimatedEarnings}
      isLoadingForecast={isLoadingForecast}
      ownerView
      isOpen
    />
  )

  const sidebarProps: SidebarProps = {
    title: sidebar.title,
    content: sidebarContent,
    customHeader:
      !isDrawerOpen && isMobileOrTablet ? (
        <SidebarMobileHeader
          type="open"
          amount={estimatedEarnings}
          token={getDisplayToken(vault.inputToken.symbol)}
          isLoadingForecast={isLoadingForecast}
        />
      ) : undefined,
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
    isMobileOrTablet,
  }

  const nextTransactionType = nextTransaction?.type

  const resovledSidebarProps =
    tosState.status !== TOSStatus.DONE &&
    nextTransactionType &&
    [TransactionType.Approve, TransactionType.Deposit].includes(nextTransactionType)
      ? tosSidebarProps
      : sidebarProps

  const estimatedSumrPrice = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP

  return (
    <VaultOpenGrid
      isMobileOrTablet={isMobileOrTablet}
      vault={vault}
      vaults={vaults}
      medianDefiYield={medianDefiYield}
      displaySimulationGraph={displaySimulationGraph}
      sumrPrice={estimatedSumrPrice}
      onRefresh={revalidatePositionData}
      vaultApy={vaultApy}
      simulationGraph={
        <VaultSimulationGraph
          vault={vault}
          forecast={forecast}
          isLoadingForecast={isLoadingForecast}
          amount={amountParsed}
        />
      }
      detailsContent={
        <VaultOpenViewDetails
          vault={vault}
          vaults={vaults}
          userActivity={userActivity}
          topDepositors={topDepositors}
          arksHistoricalChartData={arksHistoricalChartData}
          arksInterestRates={arksInterestRates}
        />
      }
      sidebarContent={
        <>
          <Sidebar {...resovledSidebarProps} />
          {userWalletAddress && (
            <TransakWidget
              cryptoCurrency={vault.inputToken.symbol}
              walletAddress={userWalletAddress}
              email={user?.email}
              isOpen={isTransakOpen}
              onClose={() => setIsTransakOpen(false)}
            />
          )}
        </>
      }
      rightExtraContent={
        migrationsEnabled &&
        migratablePositions.length > 0 &&
        migrationBestVaultApy && (
          <MigrationBox
            migratablePositions={migratablePositions}
            selectedPosition={selectedPosition}
            onSelectPosition={handleSelectPosition}
            cta={{
              link: getMigrationLandingPageUrl({
                walletAddress: userWalletAddress,
                selectedPosition,
              }),
            }}
            migrationBestVaultApy={migrationBestVaultApy}
          />
        )
      }
    />
  )
}

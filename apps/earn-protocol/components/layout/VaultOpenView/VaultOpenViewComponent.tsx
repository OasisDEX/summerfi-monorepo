import { useCallback, useEffect, useMemo, useState } from 'react'
import { useUser } from '@account-kit/react'
import {
  AccountKitAccountType,
  ControlsDepositWithdraw,
  getDisplayToken,
  getMigrationLandingPageUrl,
  isUserSmartAccount,
  ProjectedEarningsCombined,
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
  useUserWallet,
  VaultOpenGrid,
} from '@summerfi/app-earn-ui'
import { useTermsOfService } from '@summerfi/app-tos'
import {
  type ArksHistoricalChartData,
  type DropdownRawOption,
  type GetVaultsApyResponse,
  type InterestRates,
  type SDKVaultishType,
  type SDKVaultsListType,
  type SDKVaultType,
  SupportedNetworkIds,
  TOSStatus,
  TransactionAction,
  type VaultApyData,
} from '@summerfi/app-types'
import { subgraphNetworkToSDKId, supportedSDKNetwork } from '@summerfi/app-utils'
import { getChainInfoByChainId, type IToken, TransactionType } from '@summerfi/sdk-common'

import { type MigratablePosition } from '@/app/server-handlers/migration'
import { type LatestActivityPagination } from '@/app/server-handlers/tables-data/latest-activity/types'
import { type RebalanceActivityPagination } from '@/app/server-handlers/tables-data/rebalance-activity/types'
import { type TopDepositorsPagination } from '@/app/server-handlers/tables-data/top-depositors/types'
import { RebalancingNoticeBanner } from '@/components/layout/RebalancingNoticeBanner/RebalancingNoticeBanner'
import { VaultSimulationGraph } from '@/components/layout/VaultOpenView/VaultSimulationGraph'
import { ControlsApproval, OrderInfoDeposit } from '@/components/molecules/SidebarElements'
import { TermsOfServiceCookiePrefix, TermsOfServiceVersion } from '@/constants/terms-of-service'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { useSystemConfig } from '@/contexts/SystemConfigContext/SystemConfigContext'
import { BeachClubReferralForm } from '@/features/beach-club/components/BeachClubReferralForm/BeachClubReferralForm'
import { MigrationBox } from '@/features/migration/components/MigrationBox/MigrationBox'
import { getMigrationBestVaultApy } from '@/features/migration/helpers/get-migration-best-vault-apy'
import { mapMigrationResponse } from '@/features/migration/helpers/map-migration-response'
import { type MigrationEarningsDataByChainId } from '@/features/migration/types'
import { TransakWidget } from '@/features/transak/components/TransakWidget/TransakWidget'
import { filterOutSonicFromVaults } from '@/helpers/filter-out-sonic-from-vaults'
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

import { VaultOpenViewDetails } from './VaultOpenViewDetails'

type VaultOpenViewComponentProps = {
  vault: SDKVaultType | SDKVaultishType
  vaults: SDKVaultsListType
  latestActivity: LatestActivityPagination
  topDepositors: TopDepositorsPagination
  rebalanceActivity: RebalanceActivityPagination
  medianDefiYield?: number
  arksHistoricalChartData: ArksHistoricalChartData
  arksInterestRates: InterestRates
  vaultApyData: VaultApyData
  vaultsApyRaw: GetVaultsApyResponse
  referralCode?: string
}

export const VaultOpenViewComponent = ({
  vault,
  vaults,
  latestActivity,
  topDepositors,
  rebalanceActivity,
  medianDefiYield,
  arksHistoricalChartData,
  arksInterestRates,
  vaultApyData,
  vaultsApyRaw,
  referralCode: referralCodeFromCookie,
}: VaultOpenViewComponentProps) => {
  const { getStorageOnce } = useLocalStorageOnce<{
    amount: string
    token: string
  }>({
    key: `${vault.id}-amount`,
  })
  const { publicClient } = useNetworkAlignedClient()
  const { deviceType } = useDeviceType()
  const { isMobileOrTablet } = useMobileCheck(deviceType)
  const userAAKit = useUser()
  const userIsSmartAccount = isUserSmartAccount(userAAKit)

  const { features } = useSystemConfig()

  const migrationsEnabled = !!features?.Migrations

  const { userWalletAddress } = useUserWallet()

  const vaultChainId = subgraphNetworkToSDKId(supportedSDKNetwork(vault.protocol.network))

  const {
    state: { sumrNetApyConfig, slippageConfig },
  } = useLocalConfig()
  const sdk = useAppSDK()

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [migratablePositions, setMigratablePositions] = useState<MigratablePosition[]>([])
  const [migrationBestVaultApy, setMigrationBestVaultApy] =
    useState<MigrationEarningsDataByChainId>()

  const [referralCodeError, setReferralCodeError] = useState<string | null>(null)
  const [referralCode, setReferralCode] = useState<string>(referralCodeFromCookie ?? '')

  const [isNewUser, setIsNewUser] = useState(false)

  const beachClubEnabled = !!features?.BeachClub && !!userWalletAddress && isNewUser

  const handleReferralCodeError = useCallback((error: string | null) => {
    setReferralCodeError(error)
  }, [])

  const handleReferralCodeChange = useCallback((value: string) => {
    setReferralCode(value)
  }, [])

  useEffect(() => {
    const fetchMigratablePositions = async (walletAddress: string) => {
      const promises = Object.values(SupportedNetworkIds)
        .filter((networkId): networkId is number => typeof networkId === 'number')
        .map(async (chainId) => {
          const chainInfo = getChainInfoByChainId(Number(chainId))

          let positionsData
          let apyData

          try {
            positionsData = await sdk.getMigratablePositions({ walletAddress, chainInfo })
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(`Failed to fetch migratable positions for chain ${chainId}:`, error)
            positionsData = {
              chainInfo,
              positions: [],
            }
          }

          try {
            apyData = await sdk.getMigratablePositionsApy({
              chainInfo,
              positionIds: positionsData.positions.map((p) => p.id),
            })
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(`Failed to fetch APY data for chain ${chainId}:`, error)
            apyData = {
              chainInfo,
              apyByPositionId: {},
            }
          }

          return { positionsData, apyData }
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

    const fetchIfUserHasPositions = async (walletAddress: string) => {
      try {
        const response = await fetch(`/earn/api/beach-club/validate-if-new-user/${walletAddress}`)

        const data = await response.json()

        const updatedIsNewUser = data.isNewUser

        setIsNewUser(updatedIsNewUser)

        // make sure that if referral exists in cookies, but user is not new, we clear it
        // so code wont be used in transaction
        if (!updatedIsNewUser) {
          setReferralCode('')
        }

        return updatedIsNewUser
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching if user is new', error)
        setIsNewUser(false)
      }
    }

    if (userWalletAddress) {
      fetchMigratablePositions(userWalletAddress)
      fetchIfUserHasPositions(userWalletAddress)
    }
  }, [userWalletAddress, sdk, vaults, vaultsApyRaw])

  const [selectedPosition, setSelectedPosition] = useState<string | undefined>(
    migratablePositions[0]?.id,
  )

  const handleSelectPosition = (id: string) => {
    setSelectedPosition(id)
  }

  const { handleTokenSelectionChange, setSelectedTokenOption, selectedTokenOption, tokenOptions } =
    useTokenSelector({
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
  const handleTokenSelectionChangeWrapper = (option: DropdownRawOption) => {
    handleSetTokenBalanceLoading(true)
    handleTokenSelectionChange(option)
  }

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
    sidebarTransactionType: TransactionAction.DEPOSIT,
    referralCode,
    referralCodeError,
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
    sidebarTransactionType: TransactionAction.DEPOSIT,
    selectedTokenOption,
    sdk,
    slippageConfig,
  })

  const resolvedAmountParsed = getResolvedForecastAmountParsed({
    amountParsed,
    rawToTokenAmount,
  })

  const { forecast, isLoadingForecast, oneYearEarningsForecast, forecastSummaryMap } = useForecast({
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

  const filteredVaults = useMemo(() => {
    if (userIsSmartAccount) {
      return filterOutSonicFromVaults(vaults)
    }

    return vaults
  }, [vaults, userIsSmartAccount])

  const { tosSidebarProps } = useTermsOfServiceSidebar({ tosState, handleGoBack: backToInit })

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
    publicClient,
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
      [TransactionType.Withdraw]: null, // just for types, withdraw doesn't happen on open view
      [TransactionType.VaultSwitch]: null, // just for types, switch doesn't happen on open view
    }[nextTransaction.type]
  ) : (
    <ControlsDepositWithdraw
      amountDisplay={amountDisplay}
      amountDisplayUSD={amountDisplayUSDWithSwap}
      handleAmountChange={handleAmountChange}
      handleDropdownChange={handleTokenSelectionChangeWrapper}
      options={tokenOptions}
      dropdownValue={selectedTokenOption}
      onFocus={onFocus}
      onBlur={onBlur}
      tokenSymbol={selectedTokenOption.value}
      tokenBalance={selectedTokenBalance}
      tokenBalanceLoading={selectedTokenBalanceLoading}
      manualSetAmount={manualSetAmount}
      ownerView
      contentAfterInput={
        beachClubEnabled ? (
          <BeachClubReferralForm
            onError={handleReferralCodeError}
            onChange={handleReferralCodeChange}
            refferalCodeFromCookie={referralCodeFromCookie}
          />
        ) : undefined
      }
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
        {!nextTransaction?.type ? (
          <ProjectedEarningsCombined
            vault={vault}
            amountDisplay={amountDisplay}
            estimatedEarnings={estimatedEarnings}
            isLoadingForecast={isLoadingForecast}
            forecastSummaryMap={forecastSummaryMap}
            isOpen
          />
        ) : null}
        <SidebarFootnote
          title={sidebarFootnote.title}
          list={sidebarFootnote.list}
          tooltip={sidebarFootnote.tooltip}
        />
      </>
    ),
    error: sidebar.error ?? referralCodeError,
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
    <>
      <RebalancingNoticeBanner vault={vault} />
      <VaultOpenGrid
        isMobileOrTablet={isMobileOrTablet}
        vault={vault}
        vaults={filteredVaults}
        medianDefiYield={medianDefiYield}
        displaySimulationGraph={displaySimulationGraph}
        sumrPrice={estimatedSumrPrice}
        onRefresh={revalidatePositionData}
        vaultApyData={vaultApyData}
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
            latestActivity={latestActivity}
            topDepositors={topDepositors}
            rebalanceActivity={rebalanceActivity}
            arksHistoricalChartData={arksHistoricalChartData}
            arksInterestRates={arksInterestRates}
            vaultApyData={vaultApyData}
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
                disabled: !selectedPosition,
              }}
              migrationBestVaultApy={migrationBestVaultApy}
            />
          )
        }
      />
    </>
  )
}

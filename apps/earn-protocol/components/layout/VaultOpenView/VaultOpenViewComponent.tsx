import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ControlsDepositWithdraw,
  getDisplayToken,
  // getMigrationLandingPageUrl,
  ProjectedEarningsCombined,
  Sidebar,
  SidebarFootnote,
  sidebarFootnote,
  SidebarMobileHeader,
  type SidebarProps,
  Text,
  useAmount,
  useAmountWithSwap,
  useEarnProtocolLogin,
  useEarnProtocolWallet,
  useForecast,
  useIsIframe,
  useLocalConfig,
  useLocalStorageOnce,
  useMobileCheck,
  useTokenSelector,
  VaultOpenGrid,
} from '@summerfi/app-earn-ui'
import { useTermsOfService } from '@summerfi/app-tos'
import {
  type DropdownRawOption,
  type RewardTokenPrices,
  type SDKVaultishType,
  type SDKVaultsListType,
  type SDKVaultType,
  type SupportedSDKNetworks,
  // SupportedNetworkIds,
  TOSStatus,
  TransactionAction,
  type VaultApyData,
} from '@summerfi/app-types'
import { slugify, subgraphNetworkToSDKId, supportedSDKNetwork } from '@summerfi/app-utils'
import {
  // getChainInfoByChainId,
  type IArmadaVaultInfo,
  type IToken,
  RoundState,
  TransactionType,
} from '@summerfi/sdk-common'
import { useQueryClient } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'

// import { type MigratablePosition } from '@/app/server-handlers/raw-calls/migration'
import { ArbitrumNoticeBanner } from '@/components/layout/ArbitrumNoticeBanner/ArbitrumNoticeBanner'
import { RebalancingNoticeBanner } from '@/components/layout/RebalancingNoticeBanner/RebalancingNoticeBanner'
import { RwaSidebarInfo } from '@/components/layout/RwaVault/RwaSidebarInfo'
import { getRwaReceiptsHistoryBaseQueryKey } from '@/components/layout/VaultManageView/vault-manage-query-keys'
import { useVaultOpenDetailsQuery } from '@/components/layout/VaultOpenView/useVaultOpenQuery'
import { VaultSimulationGraph } from '@/components/layout/VaultOpenView/VaultSimulationGraph'
import { ControlsApproval, OrderInfoDeposit } from '@/components/molecules/SidebarElements'
import { TermsOfServiceCookiePrefix, TermsOfServiceVersion } from '@/constants/terms-of-service'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { useSystemConfig } from '@/contexts/SystemConfigContext/SystemConfigContext'
import { BeachClubReferralForm } from '@/features/beach-club/components/BeachClubReferralForm/BeachClubReferralForm'
// import { MigrationBox } from '@/features/migration/components/MigrationBox/MigrationBox'
// import { getMigrationBestVaultApy } from '@/features/migration/helpers/get-migration-best-vault-apy'
// import { mapMigrationResponse } from '@/features/migration/helpers/map-migration-response'
// import { type MigrationEarningsDataByChainId } from '@/features/migration/types'
import { TransakWidget } from '@/features/transak/components/TransakWidget/TransakWidget'
import { getResolvedForecastAmountParsed } from '@/helpers/get-resolved-forecast-amount-parsed'
import { useAppSDK } from '@/hooks/use-app-sdk'
import { useGasEstimation } from '@/hooks/use-gas-estimation'
import { useIsWhitelisted } from '@/hooks/use-is-whitelisted'
import {
  useHandleButtonClickEvent,
  useHandleDropdownChangeEvent,
  useHandleInputChangeEvent,
  useHandleTooltipOpenEvent,
} from '@/hooks/use-mixpanel-event'
import { useNetworkAlignedClient } from '@/hooks/use-network-aligned-client'
import { usePosition } from '@/hooks/use-position'
import { useRedirectToPositionView } from '@/hooks/use-redirect-to-position'
import { useRevalidatePositionData, useRevalidateUser } from '@/hooks/use-revalidate'
import { useRwaClaim } from '@/hooks/use-rwa-claim'
import { useRwaRoundInfo } from '@/hooks/use-rwa-round-info'
import { useRwaSDK } from '@/hooks/use-rwa-sdk'
import {
  getRwaUserVaultExposureQueryKey,
  useRwaUserVaultExposure,
} from '@/hooks/use-rwa-user-vault-exposure'
import {
  getRwaVaultMarketValueQueryKey,
  useRwaVaultMarketValue,
} from '@/hooks/use-rwa-vault-market-value'
import { useTermsOfServiceSidebar } from '@/hooks/use-terms-of-service-sidebar'
import { useTermsOfServiceSigner } from '@/hooks/use-terms-of-service-signer'
import { useTokenBalance } from '@/hooks/use-token-balance'
import { useTransaction } from '@/hooks/use-transaction'

import { VaultOpenDetailsLoading } from './VaultOpenDetailsLoading'
import { VaultOpenViewDetails } from './VaultOpenViewDetails'

type VaultOpenViewComponentProps = {
  network: SupportedSDKNetworks
  vaultId: string
  vault: SDKVaultType | SDKVaultishType
  vaults: SDKVaultsListType
  vaultInfo?: IArmadaVaultInfo
  medianDefiYield?: number
  vaultApyData: VaultApyData
  // vaultsApyRaw: GetVaultsApyResponse
  referralCode?: string
  rewardTokenPrices: RewardTokenPrices
}

export const VaultOpenViewComponent = ({
  network,
  vaultId,
  vault,
  vaultInfo,
  vaults,
  medianDefiYield,
  vaultApyData,
  // vaultsApyRaw,
  referralCode: referralCodeFromCookie,
  rewardTokenPrices,
}: VaultOpenViewComponentProps) => {
  // Below-the-fold details stream in independently of the deposit sidebar: hydrated on first
  // render, or fetched via the API route fallback (showing VaultOpenDetailsLoading) if the
  // prefetch failed to dehydrate.
  const { data: details } = useVaultOpenDetailsQuery(network, vaultId)

  const isRwaVault = vault.isRwaVault ?? false
  const { getStorageOnce } = useLocalStorageOnce<{
    amount: string
    token: string
  }>({
    key: `${vault.id}-amount`,
  })
  const { publicClient } = useNetworkAlignedClient()
  const { deviceType } = useDeviceType()
  const tooltipEventHandler = useHandleTooltipOpenEvent()
  const inputChangeHandler = useHandleInputChangeEvent()
  const buttonClickEventHandler = useHandleButtonClickEvent()
  const dropdownChangeHandler = useHandleDropdownChangeEvent()
  const { isMobileOrTablet } = useMobileCheck(deviceType)

  const { features } = useSystemConfig()

  // const migrationsEnabled = !!features?.Migrations

  const { address: userWalletAddress } = useEarnProtocolWallet()
  const { login, logout } = useEarnProtocolLogin()

  // RWA vaults are permissioned: disconnect the current wallet and restart the
  // login flow so the user can connect a wallet that has passed KYC/AML checks.
  const handleConnectWhitelistedWallet = useCallback(async () => {
    await logout()
    login()
  }, [login, logout])

  const vaultChainId = subgraphNetworkToSDKId(supportedSDKNetwork(vault.protocol.network))

  const {
    state: { slippageConfig },
  } = useLocalConfig()
  const sdk = useAppSDK()
  // RWA (rounds-based) calls go through the institutional SDK; standard vault calls use `sdk`.
  const rwaSdk = useRwaSDK()

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  // const [migratablePositions, setMigratablePositions] = useState<MigratablePosition[]>([])
  // const [migrationBestVaultApy, setMigrationBestVaultApy] =
  //   useState<MigrationEarningsDataByChainId>()

  const [referralCodeError, setReferralCodeError] = useState<string | null>(null)
  const [referralCode, setReferralCode] = useState<string>(referralCodeFromCookie ?? '')

  const [isNewUser, setIsNewUser] = useState(false)
  const revalidatePositionData = useRevalidatePositionData()
  const revalidateUser = useRevalidateUser()
  const queryClient = useQueryClient()

  const beachClubEnabled = !!features?.BeachClub && !!userWalletAddress && isNewUser

  const handleReferralCodeError = useCallback((error: string | null) => {
    setReferralCodeError(error)
  }, [])

  const handleReferralCodeChange = useCallback((value: string) => {
    setReferralCode(value)
  }, [])

  useEffect(() => {
    // const fetchMigratablePositions = async (walletAddress: string) => {
    //   const promises = Object.values(SupportedNetworkIds)
    //     .filter((networkId): networkId is number => typeof networkId === 'number')
    //     .map(async (chainId) => {
    //       const chainInfo = getChainInfoByChainId(Number(chainId))

    //       let positionsData
    //       let apyData

    //       try {
    //         positionsData = await sdk.getMigratablePositions({ walletAddress, chainInfo })
    //       } catch (error) {
    //         // eslint-disable-next-line no-console
    //         console.error(`Failed to fetch migratable positions for chain ${chainId}:`, error)
    //         positionsData = {
    //           chainInfo,
    //           positions: [],
    //         }
    //       }

    //       try {
    //         apyData = await sdk.getMigratablePositionsApy({
    //           chainInfo,
    //           positionIds: positionsData.positions.map((p) => p.id),
    //         })
    //       } catch (error) {
    //         // eslint-disable-next-line no-console
    //         console.error(`Failed to fetch APY data for chain ${chainId}:`, error)
    //         apyData = {
    //           chainInfo,
    //           apyByPositionId: {},
    //         }
    //       }

    //       return { positionsData, apyData }
    //     })

    //   const positions = await Promise.all(promises)

    //   const mappedPositions = mapMigrationResponse(positions)

    //   const mappedBestVaultApy = getMigrationBestVaultApy({
    //     migratablePositions: mappedPositions,
    //     vaultsWithConfig: vaults,
    //     vaultsApyByNetworkMap: vaultsApyRaw,
    //   })

    //   setMigratablePositions(mappedPositions)
    //   setMigrationBestVaultApy(mappedBestVaultApy)
    // }

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

        return false
      }
    }

    if (userWalletAddress) {
      // fetchMigratablePositions(userWalletAddress)
      fetchIfUserHasPositions(userWalletAddress)
    }
    // }, [userWalletAddress, sdk, vaults, vaultsApyRaw])
  }, [userWalletAddress])

  // const [selectedPosition, setSelectedPosition] = useState<string | undefined>(
  //   migratablePositions[0]?.id,
  // )

  // const handleSelectPosition = (id: string) => {
  //   setSelectedPosition(id)
  // }

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
    buttonClickEventHandler(`vault-manage-change-token-to-${slugify(option.value)}`)
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
    inputChangeHandler,
    inputName: 'vault-open-amount',
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
    inputChangeHandler,
    inputName: 'vault-open-approval-amount',
  })

  const { isWhitelisted, isLoading: isWhitelistedLoading } = useIsWhitelisted({
    isRwaVault,
    sdk: rwaSdk,
    walletAddress: userWalletAddress,
    fleetAddress: vault.id,
    chainId: vaultChainId,
  })

  // RWA vaults are rounds-based: surface the current deposit round so the user
  // knows which round their deposit enters, and block deposits when that round
  // is not currently open.
  const { roundState: rwaRoundState, isLoading: isRwaRoundLoading } = useRwaRoundInfo({
    enabled: isRwaVault && isWhitelisted,
    sdk: rwaSdk,
    fleetAddress: vault.id,
    chainId: vaultChainId,
  })

  // While the round is not Opened (NotOpened / InSettlement / Settled) deposits
  // cannot be accepted, so we disable the deposit button.
  const blockRwaDeposit =
    isRwaVault && isWhitelisted && !isRwaRoundLoading && rwaRoundState !== RoundState.Opened

  // Pre-claim RWA users (receipts, no Fleet shares) land on this open view, so the deposits/
  // withdrawals history table (with claim/cancel) lives here too. Refresh it + the portfolio
  // user-data cache after a deposit/claim/cancel.
  const handleRwaReceiptsRefresh = useCallback(() => {
    if (!userWalletAddress) {
      return
    }
    queryClient.invalidateQueries({
      queryKey: getRwaReceiptsHistoryBaseQueryKey(network, vaultId, userWalletAddress),
    })
    // Also refresh the exposure query so `hasRwaExposure` flips once the deposit is indexed, which
    // forwards a receipts-only holder to their manage view (mirrors the regular-vault post-deposit
    // redirect that fires when the settled position appears).
    queryClient.invalidateQueries({
      queryKey: getRwaUserVaultExposureQueryKey(vaultChainId, vault.id, userWalletAddress),
    })
    // And the vault-wide market value, whose pending-deposits component grows with this deposit.
    queryClient.invalidateQueries({
      queryKey: getRwaVaultMarketValueQueryKey(vaultChainId, vault.id),
    })
    revalidateUser(userWalletAddress)
  }, [queryClient, network, vaultId, userWalletAddress, revalidateUser, vaultChainId, vault.id])

  const {
    executeAction: executeRwaAction,
    actionInProgressKey: rwaActionInProgressKey,
    error: rwaActionError,
  } = useRwaClaim({
    sdk: rwaSdk,
    fleetAddress: vault.id,
    chainId: vaultChainId,
    tokenDecimals: vault.inputToken.decimals,
    walletAddress: userWalletAddress,
    onSuccess: handleRwaReceiptsRefresh,
  })

  const {
    approvalType,
    approvalTokenSymbol,
    setApprovalType,
    sidebar,
    nextTransaction,
    backToInit,
    isTransakOpen,
    setIsTransakOpen,
  } = useTransaction({
    vault,
    vaultChainId,
    isRwaVault,
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
    // Refresh the RWA history table once a deposit mints its pending receipt.
    onTransactionSuccess: handleRwaReceiptsRefresh,
  })

  const { position } = usePosition({
    chainId: vaultChainId,
    vaultId: vault.id,
    // RWA Fleet positions live in the institutional subgraph; read them via the RWA SDK so a
    // whitelisted holder who has claimed shares is redirected from the open page to their position.
    isRwaVault,
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
  // A whitelisted, receipts-only RWA holder (no settled Fleet position) is forwarded to their manage
  // view, which renders a "settling" position from this exposure.
  const { data: rwaExposure } = useRwaUserVaultExposure({
    enabled: isRwaVault && isWhitelisted,
    sdk: rwaSdk,
    fleetAddress: vault.id,
    walletAddress: userWalletAddress,
    chainId: vaultChainId,
  })
  const hasRwaExposure = !!rwaExposure && new BigNumber(rwaExposure.total.amount).gt(0)

  // Vault-wide true TVL (Fleet assets + pending deposits + claimable withdrawals). The subgraph TVL
  // only reflects settled Fleet assets, so the open-view "Market Value" uses this to include the
  // settling deposits. Public (no wallet), so it loads for any visitor of an RWA vault.
  const { data: rwaMarketValue, isLoading: rwaMarketValueLoading } = useRwaVaultMarketValue({
    enabled: isRwaVault,
    sdk: rwaSdk,
    fleetAddress: vault.id,
    chainId: vaultChainId,
  })

  useRedirectToPositionView({ vault, position, hasRwaExposure })

  const displaySimulationGraph = amountParsed.gt(0)

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
          sidebarTransactionType={TransactionAction.DEPOSIT}
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
    }[nextTransaction.type as TransactionType.Approve | TransactionType.Deposit]
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
        isRwaVault && isWhitelisted ? null : beachClubEnabled ? (
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
    primaryButton: {
      ...sidebar.primaryButton,
      // Block deposits while the RWA round is not open; otherwise keep the
      // executor's own disabled state.
      disabled: blockRwaDeposit ? true : sidebar.primaryButton.disabled,
    },
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
          handleTooltipOpen={tooltipEventHandler}
          tooltipName="vault-open"
        />
      </>
    ),
    error: sidebar.error ?? referralCodeError,
    isMobileOrTablet,
  }

  const nextTransactionType = nextTransaction?.type

  // RWA vaults can only be entered by whitelisted wallets. Until the connected wallet is
  // confirmed whitelisted, replace the deposit/TOS sidebar with the permissioned notice.
  const showPermissionedSidebar = isRwaVault && !isWhitelisted

  const permissionedSidebarProps: SidebarProps = {
    title: 'Permissioned Vault',
    content: (
      <Text
        as="p"
        variant="p3semi"
        style={{ color: 'var(--earn-protocol-secondary-60)', margin: '8px 0 24px 0' }}
      >
        This Vault is restricted to users and their wallets which have been approved for access
        through KYC/AML checks either through Summer.fi or an approved custodian or wallet provider.
      </Text>
    ),
    primaryButton: {
      label: 'Connect a whitelisted wallet',
      action: handleConnectWhitelistedWallet,
      loading: isWhitelistedLoading,
    },
    isMobileOrTablet,
    handleIsDrawerOpen: (flag: boolean) => setIsDrawerOpen(flag),
  }

  const resovledSidebarProps = showPermissionedSidebar
    ? permissionedSidebarProps
    : tosState.status !== TOSStatus.DONE &&
        nextTransactionType &&
        [TransactionType.Approve, TransactionType.Deposit].includes(nextTransactionType)
      ? tosSidebarProps
      : sidebarProps

  return (
    <>
      <RebalancingNoticeBanner vault={vault} />
      <ArbitrumNoticeBanner vault={vault} />
      <VaultOpenGrid
        isMobileOrTablet={isMobileOrTablet}
        vault={vault}
        vaultInfo={vaultInfo}
        rwaMarketValue={rwaMarketValue}
        rwaMarketValueLoading={rwaMarketValueLoading}
        rewardTokenPrices={rewardTokenPrices}
        vaults={vaults}
        medianDefiYield={medianDefiYield}
        displaySimulationGraph={displaySimulationGraph}
        onRefresh={revalidatePositionData}
        vaultApyData={vaultApyData}
        tooltipEventHandler={tooltipEventHandler}
        buttonClickEventHandler={buttonClickEventHandler}
        dropdownChangeHandler={dropdownChangeHandler}
        simulationGraph={
          <VaultSimulationGraph
            vault={vault}
            forecast={forecast}
            isLoadingForecast={isLoadingForecast}
            amount={amountParsed}
          />
        }
        detailsContent={
          details ? (
            <VaultOpenViewDetails
              vault={vault}
              latestActivity={details.latestActivity}
              topDepositors={details.topDepositors}
              rebalanceActivity={details.rebalanceActivity}
              curationEvents={details.curationEvents}
              arksHistoricalChartData={details.arksHistoricalChartData}
              rwaNavHistoricalChartData={details.rwaNavHistoricalChartData}
              arksInterestRates={details.arksInterestRates}
              vaultApyData={vaultApyData}
              isDaoManaged={vault.isDaoManaged}
              isRwaVault={vault.isRwaVault}
              network={network}
              vaultId={vaultId}
              walletAddress={userWalletAddress}
              isWhitelisted={isWhitelisted}
              onRwaAction={executeRwaAction}
              rwaActionInProgressKey={rwaActionInProgressKey}
              rwaActionError={rwaActionError}
            />
          ) : (
            <VaultOpenDetailsLoading vault={vault} isDaoManaged={vault.isDaoManaged} />
          )
        }
        sidebarContent={
          <>
            <Sidebar {...resovledSidebarProps} />
            {userWalletAddress && (
              <TransakWidget
                cryptoCurrency={vault.inputToken.symbol}
                walletAddress={userWalletAddress}
                isOpen={isTransakOpen}
                onClose={() => setIsTransakOpen(false)}
              />
            )}
          </>
        }
        // rightExtraContent={
        //   migrationsEnabled &&
        //   migratablePositions.length > 0 &&
        //   migrationBestVaultApy && (
        //     <MigrationBox
        //       migratablePositions={migratablePositions}
        //       selectedPosition={selectedPosition}
        //       onSelectPosition={handleSelectPosition}
        //       cta={{
        //         link: getMigrationLandingPageUrl({
        //           walletAddress: userWalletAddress,
        //           selectedPosition,
        //         }),
        //         disabled: !selectedPosition,
        //       }}
        //       migrationBestVaultApy={migrationBestVaultApy}
        //     />
        //   )
        // }
        rightExtraContent={isRwaVault ? <RwaSidebarInfo /> : null}
      />
    </>
  )
}

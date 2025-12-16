'use client'
import { type FC, useCallback, useMemo, useReducer, useState } from 'react'
import { useChain } from '@account-kit/react'
import {
  getDisplayToken,
  getResolvedForecastAmountParsed,
  getVaultPositionUrl,
  SDKChainIdToAAChainMap,
  Sidebar,
  SidebarMobileHeader,
  type SidebarProps,
  SUMR_CAP,
  useAmountWithSwap,
  useClientChainId,
  useForecast,
  useLocalConfig,
  useMobileCheck,
  useUserWallet,
  VaultOpenGrid,
} from '@summerfi/app-earn-ui'
import {
  type ArksHistoricalChartData,
  type IArmadaVaultInfo,
  type InterestRates,
  type SDKVaultishType,
  type SDKVaultsListType,
  type SDKVaultType,
  TransactionAction,
  type VaultApyData,
} from '@summerfi/app-types'
import { subgraphNetworkToSDKId, supportedSDKNetwork } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import { usePathname, useRouter } from 'next/navigation'
import { type Address } from 'viem'

import { type MigratablePosition } from '@/app/server-handlers/raw-calls/migration'
import { type LatestActivityPagination } from '@/app/server-handlers/tables-data/latest-activity/types'
import { type RebalanceActivityPagination } from '@/app/server-handlers/tables-data/rebalance-activity/types'
import { type TopDepositorsPagination } from '@/app/server-handlers/tables-data/top-depositors/types'
import { VaultOpenViewDetails } from '@/components/layout/VaultOpenView/VaultOpenViewDetails'
import { VaultSimulationGraph } from '@/components/layout/VaultOpenView/VaultSimulationGraph'
import { TransactionHashPill } from '@/components/molecules/TransactionHashPill/TransactionHashPill'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { MigrationSidebarContent } from '@/features/migration/components/MigrationSidebarContent/MigrationSidebarContent'
import { getMigrationFormTitle } from '@/features/migration/helpers/get-migration-form-title'
import { getMigrationPrimaryBtnLabel } from '@/features/migration/helpers/get-migration-primary-btn-label'
import { getMigrationSidebarError } from '@/features/migration/helpers/get-migration-sidebar-error'
import { useMigrationTransaction } from '@/features/migration/hooks/use-migration-transaction'
import { migrationReducer, migrationState } from '@/features/migration/state'
import { MigrationSteps, MigrationTxStatuses } from '@/features/migration/types'
import { useAppSDK } from '@/hooks/use-app-sdk'
import { useGasEstimation } from '@/hooks/use-gas-estimation'
import {
  useHandleButtonClickEvent,
  useHandleDropdownChangeEvent,
  useHandleTooltipOpenEvent,
} from '@/hooks/use-mixpanel-event'
import { useNetworkAlignedClient } from '@/hooks/use-network-aligned-client'
import { useRevalidatePositionData } from '@/hooks/use-revalidate'

type MigrationVaultPageComponentProps = {
  vault: SDKVaultishType
  vaults: SDKVaultsListType
  vaultInfo?: IArmadaVaultInfo
  topDepositors: TopDepositorsPagination
  latestActivity: LatestActivityPagination
  rebalanceActivity: RebalanceActivityPagination
  medianDefiYield?: number
  arksHistoricalChartData: ArksHistoricalChartData
  arksInterestRates: InterestRates
  vaultApyData: VaultApyData
  migratablePosition: MigratablePosition
  walletAddress: string
}

export const MigrationVaultPageComponent: FC<MigrationVaultPageComponentProps> = ({
  vault,
  vaults,
  vaultInfo,
  latestActivity,
  topDepositors,
  rebalanceActivity,
  medianDefiYield,
  arksHistoricalChartData,
  arksInterestRates,
  vaultApyData,
  migratablePosition,
  walletAddress,
}) => {
  const { deviceType } = useDeviceType()
  const { isMobile, isTablet } = useMobileCheck(deviceType)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { push } = useRouter()
  const vaultChainId = subgraphNetworkToSDKId(supportedSDKNetwork(vault.protocol.network))
  const { setChain, isSettingChain } = useChain()
  const tooltipEventHandler = useHandleTooltipOpenEvent()
  const buttonClickEventHandler = useHandleButtonClickEvent()
  const dropdownChangeHandler = useHandleDropdownChangeEvent()

  const { clientChainId } = useClientChainId()

  const pathname = usePathname()

  const getMigrationVaultUrl = useCallback(
    (option: SDKVaultType | SDKVaultishType) => {
      // Create a case-insensitive regular expression
      const regex = new RegExp(vault.id, 'iu')

      return pathname.replace(regex, option.id)
    },
    [pathname, vault.id],
  )

  const { userWalletAddress } = useUserWallet()
  const revalidatePositionData = useRevalidatePositionData()

  const [state, dispatch] = useReducer(migrationReducer, {
    ...migrationState,
    walletAddress,
  })

  const {
    state: { sumrNetApyConfig, slippageConfig },
  } = useLocalConfig()
  const sdk = useAppSDK()

  const amountParsed = new BigNumber(migratablePosition.underlyingTokenAmount.amount)

  const handleInitialStep = (initialStep: MigrationSteps) => {
    dispatch({ type: 'update-step', payload: initialStep })
  }

  const { migrationTransaction, approveTransaction, txHashes, removeTxHash } =
    useMigrationTransaction({
      onMigrationSuccess: () => {
        dispatch({ type: 'update-migration-status', payload: MigrationTxStatuses.COMPLETED })
        dispatch({ type: 'update-step', payload: MigrationSteps.COMPLETED })
      },
      onMigrationError: () => {
        dispatch({ type: 'update-migration-status', payload: MigrationTxStatuses.FAILED })
      },
      onApproveSuccess: () => {
        dispatch({ type: 'update-approve-status', payload: MigrationTxStatuses.COMPLETED })
        dispatch({ type: 'update-step', payload: MigrationSteps.MIGRATE })
      },
      onApproveError: () => {
        dispatch({ type: 'update-approve-status', payload: MigrationTxStatuses.FAILED })
      },
      walletAddress,
      fleetAddress: vault.id,
      positionId: migratablePosition.id,
      slippage: Number(slippageConfig.slippage),
      handleInitialStep,
      step: state.step,
      vaultChainId,
    })

  const { publicClient } = useNetworkAlignedClient({ chainId: vaultChainId })

  const { transactionFee, loading: transactionFeeLoading } = useGasEstimation({
    chainId: vaultChainId,
    transaction: approveTransaction?.txData ?? migrationTransaction?.txData,
    walletAddress: walletAddress as Address,
    publicClient,
  })

  const { rawToTokenAmount, isQuoteLoading } = useAmountWithSwap({
    vault,
    vaultChainId,
    amountDisplay: migratablePosition.underlyingTokenAmount.amount,
    amountDisplayUSD: migratablePosition.usdValue.amount,
    sidebarTransactionType: TransactionAction.DEPOSIT,
    selectedTokenOption: {
      label: migratablePosition.underlyingTokenAmount.token.symbol,
      value: migratablePosition.underlyingTokenAmount.token.symbol,
      icon: migratablePosition.underlyingTokenAmount.token.symbol,
    },
    sdk,
    slippageConfig,
    // Don't initialize quote loading as true if the vault and the position are the same token
    defaultQuoteLoading:
      vault.inputToken.symbol.toLowerCase() !==
      migratablePosition.underlyingTokenAmount.token.symbol.toLowerCase(),
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
    disabled: isQuoteLoading,
  })

  const estimatedEarnings = useMemo(() => {
    if (!oneYearEarningsForecast) return '0'

    return oneYearEarningsForecast
  }, [oneYearEarningsForecast])

  const isPrimaryButtonLoading =
    [state.approveStatus, state.migrationStatus].includes(MigrationTxStatuses.PENDING) ||
    state.step === MigrationSteps.INIT ||
    isSettingChain

  const isPrimaryButtonDisabled =
    isPrimaryButtonLoading || userWalletAddress?.toLowerCase() !== walletAddress.toLowerCase()

  const isCorrectNetwork = clientChainId === vaultChainId

  const handlePrimaryButtonClick = () => {
    if (!isCorrectNetwork) {
      setChain({
        chain: SDKChainIdToAAChainMap[vaultChainId],
      })

      return
    }

    if (state.step === MigrationSteps.APPROVE && approveTransaction) {
      approveTransaction.tx()
      dispatch({ type: 'update-approve-status', payload: MigrationTxStatuses.PENDING })

      return
    }

    if (state.step === MigrationSteps.MIGRATE && migrationTransaction) {
      migrationTransaction.tx()
      dispatch({ type: 'update-migration-status', payload: MigrationTxStatuses.PENDING })

      return
    }

    if (state.step === MigrationSteps.COMPLETED) {
      push(
        getVaultPositionUrl({
          network: supportedSDKNetwork(vault.protocol.network),
          vaultId: vault.customFields?.slug ?? vault.id,
          walletAddress,
        }),
      )
    }

    // eslint-disable-next-line no-console
    console.error('No action to take')
  }

  const isMobileOrTablet = isMobile || isTablet

  const networkName = SDKChainIdToAAChainMap[vaultChainId].name

  const sidebarProps: SidebarProps = {
    title: getMigrationFormTitle(state.step),
    content: (
      <MigrationSidebarContent
        estimatedEarnings={estimatedEarnings}
        migratablePosition={migratablePosition}
        vault={vault}
        state={state}
        transactionFeeLoading={transactionFeeLoading}
        transactionFee={transactionFee}
        amount={resolvedAmountParsed}
        vaultApyData={vaultApyData}
        isLoadingForecast={isLoadingForecast}
        isQuoteLoading={isQuoteLoading}
        txMetadata={migrationTransaction?.txData.metadata}
      />
    ),
    customHeader:
      !isDrawerOpen && isMobile ? (
        <SidebarMobileHeader
          type="open"
          amount={estimatedEarnings}
          token={getDisplayToken(vault.inputToken.symbol)}
          isLoadingForecast={isLoadingForecast}
        />
      ) : undefined,
    handleIsDrawerOpen: (flag: boolean) => setIsDrawerOpen(flag),
    primaryButton: {
      label: getMigrationPrimaryBtnLabel({
        state,
        isCorrectNetwork,
        networkName,
        isConnected: !!userWalletAddress,
      }),
      action: handlePrimaryButtonClick,
      disabled: isPrimaryButtonDisabled,
      loading: isPrimaryButtonLoading,
    },
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
      </>
    ),
    error: getMigrationSidebarError({ state }),
    isMobileOrTablet,
  }

  const estimatedSumrPrice = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP
  const displaySimulationGraph = amountParsed.gt(0)

  return (
    <VaultOpenGrid
      isMobileOrTablet={isMobileOrTablet}
      vault={vault}
      vaults={vaults}
      vaultInfo={vaultInfo}
      medianDefiYield={medianDefiYield}
      displaySimulationGraph={displaySimulationGraph}
      sumrPrice={estimatedSumrPrice}
      onRefresh={revalidatePositionData}
      vaultApyData={vaultApyData}
      tooltipEventHandler={tooltipEventHandler}
      buttonClickEventHandler={buttonClickEventHandler}
      dropdownChangeHandler={dropdownChangeHandler}
      headerLink={{
        label: 'Migrate',
        href: `/migrate/user/${walletAddress}`,
      }}
      disableDropdownOptionsByChainId={migratablePosition.chainId}
      getOptionUrl={getMigrationVaultUrl}
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
      sidebarContent={<Sidebar {...sidebarProps} />}
    />
  )
}

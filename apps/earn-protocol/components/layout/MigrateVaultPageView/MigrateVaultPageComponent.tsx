'use client'
import { type FC, useCallback, useMemo, useReducer, useState } from 'react'
import {
  getDisplayToken,
  getResolvedForecastAmountParsed,
  getVaultPositionUrl,
  Sidebar,
  SidebarMobileHeader,
  SUMR_CAP,
  useAmountWithSwap,
  useForecast,
  useLocalConfig,
  useMobileCheck,
  VaultOpenGrid,
} from '@summerfi/app-earn-ui'
import {
  type ArksHistoricalChartData,
  type SDKUsersActivityType,
  type SDKVaultishType,
  type SDKVaultsListType,
  type SDKVaultType,
  TransactionAction,
  type UsersActivity,
} from '@summerfi/app-types'
import { subgraphNetworkToSDKId } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import { usePathname, useRouter } from 'next/navigation'
import { type Address } from 'viem'

import { type MigratablePosition } from '@/app/server-handlers/migration'
import { VaultOpenViewDetails } from '@/components/layout/VaultOpenView/VaultOpenViewDetails'
import { VaultSimulationGraph } from '@/components/layout/VaultOpenView/VaultSimulationGraph'
import { TransactionHashPill } from '@/components/molecules/TransactionHashPill/TransactionHashPill'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { MigrationSidebarContent } from '@/features/migration/components/MigrationSidebarContent/MigrationSidebarContent'
import { getMigrationFormTitle } from '@/features/migration/helpers/get-migration-form-title'
import { getMigrationPrimaryBtnLabel } from '@/features/migration/helpers/get-migration-primary-btn-label'
import { getMigrationSidebarError } from '@/features/migration/helpers/get-migration-sidebar-error'
import { useMigrateTransaction } from '@/features/migration/hooks/use-migrate-transaction'
import { migrationReducer, migrationState } from '@/features/migration/state'
import { MigrationSteps, MigrationTxStatuses } from '@/features/migration/types'
import { revalidatePositionData } from '@/helpers/revalidation-handlers'
import { useAppSDK } from '@/hooks/use-app-sdk'
import { useGasEstimation } from '@/hooks/use-gas-estimation'
import { useUserWallet } from '@/hooks/use-user-wallet'

type MigrateVaultPageComponentProps = {
  vault: SDKVaultType | SDKVaultishType
  vaults: SDKVaultsListType
  userActivity: UsersActivity
  topDepositors: SDKUsersActivityType
  medianDefiYield?: number
  arksHistoricalChartData: ArksHistoricalChartData
  arksInterestRates?: { [key: string]: number }
  vaultApy?: number
  migratablePosition: MigratablePosition
  walletAddress: string
}

export const MigrateVaultPageComponent: FC<MigrateVaultPageComponentProps> = ({
  vault,
  vaults,
  userActivity,
  topDepositors,
  medianDefiYield,
  arksHistoricalChartData,
  arksInterestRates,
  vaultApy,
  migratablePosition,
  walletAddress,
}) => {
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { push } = useRouter()
  const vaultChainId = subgraphNetworkToSDKId(vault.protocol.network)

  const pathname = usePathname()

  const getMigrateVaultUrl = useCallback(
    (option: SDKVaultType | SDKVaultishType) => {
      // Create a case-insensitive regular expression
      const regex = new RegExp(vault.id, 'iu')

      return pathname.replace(regex, option.id)
    },
    [pathname, vault.id],
  )

  const { userWalletAddress } = useUserWallet()

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

  const { migrateTransaction, approveTransaction, txHashes, removeTxHash } = useMigrateTransaction({
    onMigrateSuccess: () => {
      dispatch({ type: 'update-migrate-status', payload: MigrationTxStatuses.COMPLETED })
      dispatch({ type: 'update-step', payload: MigrationSteps.COMPLETED })
    },
    onMigrateError: () => {
      dispatch({ type: 'update-migrate-status', payload: MigrationTxStatuses.FAILED })
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
  })

  const { transactionFee, loading: transactionFeeLoading } = useGasEstimation({
    chainId: vaultChainId,
    transaction: approveTransaction?.txData ?? migrateTransaction?.txData,
    walletAddress: walletAddress as Address,
  })

  const { rawToTokenAmount } = useAmountWithSwap({
    vault,
    vaultChainId,
    amountDisplay: migratablePosition.underlyingTokenAmount.amount,
    amountDisplayUSD: migratablePosition.usdValue.amount,
    transactionType: TransactionAction.DEPOSIT,
    selectedTokenOption: {
      label: migratablePosition.underlyingTokenAmount.token.symbol,
      value: migratablePosition.underlyingTokenAmount.token.symbol,
      icon: migratablePosition.underlyingTokenAmount.token.symbol,
    },
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

  const estimatedEarnings = useMemo(() => {
    if (!oneYearEarningsForecast) return '0'

    return oneYearEarningsForecast
  }, [oneYearEarningsForecast])

  const isPrimaryButtonLoading =
    [state.approveStatus, state.migrateStatus].includes(MigrationTxStatuses.PENDING) ||
    state.step === MigrationSteps.INIT

  const isPrimaryButtonDisabled =
    isPrimaryButtonLoading || userWalletAddress?.toLowerCase() !== walletAddress.toLowerCase()

  const handlePrimaryButtonClick = () => {
    if (state.step === MigrationSteps.APPROVE && approveTransaction) {
      approveTransaction.tx()
      dispatch({ type: 'update-approve-status', payload: MigrationTxStatuses.PENDING })

      return
    }

    if (state.step === MigrationSteps.MIGRATE && migrateTransaction) {
      migrateTransaction.tx()
      dispatch({ type: 'update-migrate-status', payload: MigrationTxStatuses.PENDING })

      return
    }

    if (state.step === MigrationSteps.COMPLETED) {
      push(
        getVaultPositionUrl({
          network: vault.protocol.network,
          vaultId: vault.customFields?.slug ?? vault.id,
          walletAddress,
        }),
      )
    }

    // eslint-disable-next-line no-console
    console.error('No action to take')
  }

  const sidebarProps = {
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
        vaultApy={vaultApy}
        isLoadingForecast={isLoadingForecast}
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
    customHeaderStyles:
      !isDrawerOpen && isMobile ? { padding: 'var(--general-space-12) 0' } : undefined,
    handleIsDrawerOpen: (flag: boolean) => setIsDrawerOpen(flag),
    primaryButton: {
      label: getMigrationPrimaryBtnLabel({ state }),
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
    isMobile,
  }

  const estimatedSumrPrice = Number(sumrNetApyConfig.dilutedValuation) / SUMR_CAP
  const displaySimulationGraph = amountParsed.gt(0)

  return (
    <VaultOpenGrid
      isMobile={isMobile}
      vault={vault}
      vaults={vaults}
      medianDefiYield={medianDefiYield}
      displaySimulationGraph={displaySimulationGraph}
      sumrPrice={estimatedSumrPrice}
      onRefresh={revalidatePositionData}
      vaultApy={vaultApy}
      headerLink={{
        label: 'Migrate',
        href: `/migrate/user/${walletAddress}`,
      }}
      disableDropdownOptionsByChainId={migratablePosition.chainId}
      getOptionUrl={getMigrateVaultUrl}
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
      sidebarContent={<Sidebar {...sidebarProps} />}
    />
  )
}

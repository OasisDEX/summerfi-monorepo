'use client'
import { type FC, useMemo, useState } from 'react'
import {
  Card,
  Expander,
  getDisplayToken,
  getResolvedForecastAmountParsed,
  getUniqueVaultId,
  Sidebar,
  SidebarMobileHeader,
  SUMR_CAP,
  Text,
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
  type TokenSymbolsList,
  type UsersActivity,
} from '@summerfi/app-types'
import {
  formatDecimalAsPercent,
  formatFiatBalance,
  subgraphNetworkToSDKId,
} from '@summerfi/app-utils'
import { type GetGlobalRebalancesQuery } from '@summerfi/sdk-client'
import BigNumber from 'bignumber.js'

import { detailsLinks } from '@/components/layout/VaultOpenView/mocks'
import { VaultOpenHeaderBlock } from '@/components/layout/VaultOpenView/VaultOpenHeaderBlock'
import { VaultSimulationGraph } from '@/components/layout/VaultOpenView/VaultSimulationGraph'
import { ArkHistoricalYieldChart } from '@/components/organisms/Charts/ArkHistoricalYieldChart'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { MigrationMiniCard } from '@/features/migration/components/MigrationBox/MigrationMiniCard/MigrationMiniCard'
import { RebalancingActivity } from '@/features/rebalance-activity/components/RebalancingActivity/RebalancingActivity'
import { UserActivity } from '@/features/user-activity/components/UserActivity/UserActivity'
import { VaultExposure } from '@/features/vault-exposure/components/VaultExposure/VaultExposure'
import { revalidatePositionData } from '@/helpers/revalidation-handlers'
import { useAppSDK } from '@/hooks/use-app-sdk'
import { useNetworkAlignedClient } from '@/hooks/use-network-aligned-client'

type MigrateVaultPageComponentProps = {
  vault: SDKVaultType | SDKVaultishType
  vaults: SDKVaultsListType
  userActivity: UsersActivity
  topDepositors: SDKUsersActivityType
  medianDefiYield?: number
  arksHistoricalChartData: ArksHistoricalChartData
  arksInterestRates?: { [key: string]: number }
}

export const MigrateVaultPageComponent: FC<MigrateVaultPageComponentProps> = ({
  vault,
  vaults,
  userActivity,
  topDepositors,
  medianDefiYield,
  arksHistoricalChartData,
  arksInterestRates,
}) => {
  const { publicClient } = useNetworkAlignedClient()
  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const vaultChainId = subgraphNetworkToSDKId(vault.protocol.network)

  const {
    state: { sumrNetApyConfig, slippageConfig },
  } = useLocalConfig()
  const sdk = useAppSDK()

  const amountParsed = new BigNumber(0)

  //   const { amountDisplayUSDWithSwap, rawToTokenAmount } = useAmountWithSwap({
  //     vault,
  //     vaultChainId,
  //     amountDisplay,
  //     amountDisplayUSD,
  //     transactionType: TransactionAction.DEPOSIT,
  //     selectedTokenOption,
  //     sdk,
  //     slippageConfig,
  //   })

  const rawToTokenAmount = new BigNumber(1)

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

  const sidebarContent = (
    <div>
      <div
        style={{
          display: 'flex',
          gap: 'var(--general-space-8)',
          marginTop: 'var(--general-space-24)',
          marginBottom: 'var(--general-space-8)',
        }}
      >
        <MigrationMiniCard
          description="Migrate"
          amount={`$${formatFiatBalance(estimatedEarnings)}`}
          change={formatDecimalAsPercent(estimatedEarnings, { plus: true })}
          token={vault.inputToken.symbol as TokenSymbolsList}
          type="from"
          network={vault.protocol.network}
        />
        <MigrationMiniCard
          description="Migrate"
          amount={`$${formatFiatBalance(estimatedEarnings)}`}
          change={formatDecimalAsPercent(estimatedEarnings, { plus: true })}
          token={vault.inputToken.symbol as TokenSymbolsList}
          type="to"
          network={vault.protocol.network}
        />
      </div>
      <div
        style={{
          display: 'flex',
          gap: 'var(--general-space-8)',
          flexDirection: 'column',
          marginBottom: 'var(--general-space-24)',
        }}
      >
        <Card variant="cardPrimaryMediumPaddingsColorfulBorder" style={{ flexDirection: 'column' }}>
          <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
            Total Deposited
          </Text>
          <Text as="p" variant="p1semi">
            $100,000 USDC
          </Text>
        </Card>
      </div>
    </div>
  )

  const sidebarProps = {
    title: 'Migrate',
    content: sidebarContent,
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
    // goBackAction: nextTransaction?.type ? backToInit : undefined,
    primaryButton: {
      label: 'Migrate',
      action: () => {},
      disabled: false,
    },
    footnote: (
      <>
        {/* {txHashes.map((transactionData) => (
          <TransactionHashPill
            key={transactionData.hash}
            transactionData={transactionData}
            removeTxHash={removeTxHash}
            chainId={vaultChainId}
          />
        ))} */}
      </>
    ),
    // error: sidebar.error,
    isMobile,
  }

  const summerVaultName = vault.customFields?.name ?? 'Summer Vault'
  const rebalancesList =
    `rebalances` in vault ? (vault.rebalances as GetGlobalRebalancesQuery['rebalances']) : []
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
      arksInterestRates={arksInterestRates}
      simulationGraph={
        <VaultSimulationGraph
          vault={vault}
          forecast={forecast}
          isLoadingForecast={isLoadingForecast}
          amount={amountParsed}
        />
      }
      detailsContent={
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-space-x-large)',
            width: '100%',
          }}
        >
          <VaultOpenHeaderBlock detailsLinks={detailsLinks} vault={vault} />
          <Expander
            title={
              <Text as="p" variant="p1semi">
                Historical yield
              </Text>
            }
            defaultExpanded
          >
            <ArkHistoricalYieldChart
              chartData={arksHistoricalChartData}
              summerVaultName={summerVaultName}
            />
          </Expander>
          <Expander
            title={
              <Text as="p" variant="p1semi">
                Vault exposure
              </Text>
            }
            defaultExpanded
          >
            <VaultExposure vault={vault} arksInterestRates={arksInterestRates} />
          </Expander>
          <Expander
            title={
              <Text as="p" variant="p1semi">
                Rebalancing activity
              </Text>
            }
            defaultExpanded
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
                Users activity
              </Text>
            }
            defaultExpanded
          >
            <UserActivity
              userActivity={userActivity}
              topDepositors={topDepositors}
              vaultId={getUniqueVaultId(vault)}
              page="open"
            />
          </Expander>
        </div>
      }
      sidebarContent={<Sidebar {...sidebarProps} />}
    />
  )
}

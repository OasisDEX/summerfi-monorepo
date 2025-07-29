import { type FC } from 'react'
import {
  Alert,
  Card,
  Icon,
  isVaultAtLeastDaysOld,
  OrderInformation,
  SkeletonLine,
  Text,
  useLocalConfig,
} from '@summerfi/app-earn-ui'
import {
  type SDKVaultishType,
  type SDKVaultType,
  type TokenSymbolsList,
  type VaultApyData,
} from '@summerfi/app-types'
import {
  formatCryptoBalance,
  formatDecimalAsPercent,
  formatFiatBalance,
  subgraphNetworkToSDKId,
  supportedSDKNetwork,
} from '@summerfi/app-utils'
import { type TransactionMetadataMigration } from '@summerfi/sdk-common'
import { type BigNumber } from 'bignumber.js'

import { type MigratablePosition } from '@/app/server-handlers/migration'
import {
  MigrationMiniCard,
  MigrationMiniCardType,
} from '@/features/migration/components/MigrationMiniCard/MigrationMiniCard'
import { mapMigrationToPortfolioCard } from '@/features/migration/helpers/map-migration-to-portfolio-card'
import { type MigrationState, MigrationSteps } from '@/features/migration/types'

import classNames from './MigrationFormMigrateStep.module.css'

interface MigrationFormMigrateStepProps {
  estimatedEarnings: string
  migratablePosition: MigratablePosition
  vault: SDKVaultType | SDKVaultishType
  amount?: BigNumber
  transactionFeeLoading: boolean
  transactionFee?: string
  state: MigrationState
  vaultApyData: VaultApyData
  isLoadingForecast: boolean
  isQuoteLoading: boolean
  txMetadata?: TransactionMetadataMigration
}

export const MigrationFormMigrateStep: FC<MigrationFormMigrateStepProps> = ({
  estimatedEarnings,
  migratablePosition,
  vault,
  amount,
  transactionFeeLoading,
  transactionFee,
  state,
  vaultApyData,
  isLoadingForecast,
  isQuoteLoading,
  txMetadata,
}) => {
  const {
    state: { slippageConfig },
  } = useLocalConfig()

  const isVaultAtLeast7dOld = isVaultAtLeastDaysOld({ vault, days: 7 })

  const apr7d = isVaultAtLeast7dOld
    ? vaultApyData.sma7d
      ? formatDecimalAsPercent(vaultApyData.sma7d)
      : 'n/a'
    : 'New strategy'

  const sourcePositionEstimatedEarningsUSD = migratablePosition.apy
    ? Number(amount) * Number(vault.inputTokenPriceUSD ?? 0) * Number(migratablePosition.apy)
    : undefined

  const estimatedEarningsUSD = Number(estimatedEarnings) * Number(vault.inputTokenPriceUSD ?? 0)

  const apyDiff = sourcePositionEstimatedEarningsUSD
    ? (estimatedEarningsUSD - sourcePositionEstimatedEarningsUSD) /
      (Number(amount) * Number(vault.inputTokenPriceUSD ?? 0))
    : undefined

  const { platformLogo } = mapMigrationToPortfolioCard(migratablePosition)

  const withSwap =
    migratablePosition.underlyingTokenAmount.token.symbol.toUpperCase() !==
    vault.inputToken.symbol.toUpperCase()

  const priceImpactRaw = txMetadata?.priceImpactByPositionId[migratablePosition.id]?.impact?.value
  const priceImpact = priceImpactRaw
    ? formatDecimalAsPercent(priceImpactRaw / 100, { precision: 4 })
    : 'n/a'

  return (
    <div className={classNames.migrationFormContentWrapper}>
      <div className={classNames.migrationMiniCardWrapper}>
        <MigrationMiniCard
          description="Passive Lending"
          amount={
            sourcePositionEstimatedEarningsUSD
              ? `$${formatFiatBalance(sourcePositionEstimatedEarningsUSD)}`
              : undefined
          }
          token={migratablePosition.underlyingTokenAmount.token.symbol as TokenSymbolsList}
          type={MigrationMiniCardType.FROM}
          chainId={migratablePosition.chainId}
          platformLogo={platformLogo}
          isLoading={isQuoteLoading}
        />
        <MigrationMiniCard
          description="Lazy Summer"
          amount={`$${formatFiatBalance(estimatedEarningsUSD)}`}
          change={apyDiff ? formatDecimalAsPercent(apyDiff, { plus: true }) : undefined}
          token={vault.inputToken.symbol as TokenSymbolsList}
          type={MigrationMiniCardType.TO}
          chainId={subgraphNetworkToSDKId(supportedSDKNetwork(vault.protocol.network))}
          platformLogo="summer"
          isLoading={isLoadingForecast || isQuoteLoading}
        />
        <div className={classNames.migrationMiniCardIcon}>
          <Icon iconName="arrow_forward" size={20} />
        </div>
      </div>
      {apyDiff && apyDiff < 0 && !isLoadingForecast && !isQuoteLoading && (
        <Alert
          variant="warning"
          error="Although Lazy Summer current APY is lower than the previous strategy, in long term you will most likely earn more due to automated rebalancing mechanisms."
        />
      )}

      <Card variant="cardPrimaryMediumPaddingsColorfulBorder" style={{ flexDirection: 'column' }}>
        <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
          Total Deposited
        </Text>
        {isQuoteLoading ? (
          <SkeletonLine
            width="80px"
            height="14px"
            style={{ marginTop: '6px', marginBottom: 'var(--general-space-8)' }}
          />
        ) : (
          <Text
            as="p"
            variant="p1semi"
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-4)' }}
          >
            {amount ? formatCryptoBalance(amount) : <SkeletonLine width="80px" height="14px" />}{' '}
            {vault.inputToken.symbol}
          </Text>
        )}
      </Card>
      <OrderInformation
        title="What's changing"
        items={[
          { label: '7d APY', value: apr7d },
          { label: 'Currenty APY', value: formatDecimalAsPercent(vaultApyData.apy) },
          { label: 'Protocol', value: 'Lazy Summer' },
        ]}
      />
      <OrderInformation
        items={[
          ...(withSwap
            ? [
                {
                  label: 'Swap',
                  items: [
                    {
                      label: 'Price impact',
                      value: priceImpact,
                    },
                    {
                      label: 'Slippage',
                      value: formatDecimalAsPercent(Number(slippageConfig.slippage) / 100),
                    },
                  ],
                },
              ]
            : []),
          {
            label: 'Transaction Fee',
            value: transactionFee ? `$${formatFiatBalance(transactionFee)}` : 'n/a',
            tooltip: 'Estimated transaction fee for this operation',
            isLoading: transactionFeeLoading || state.step === MigrationSteps.INIT,
          },
        ]}
      />
    </div>
  )
}

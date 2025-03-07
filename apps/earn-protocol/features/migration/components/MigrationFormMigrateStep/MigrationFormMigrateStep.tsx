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
import { type SDKVaultishType, type SDKVaultType, type TokenSymbolsList } from '@summerfi/app-types'
import {
  formatCryptoBalance,
  formatDecimalAsPercent,
  formatFiatBalance,
  subgraphNetworkToSDKId,
} from '@summerfi/app-utils'
import { BigNumber } from 'bignumber.js'

import { type MigratablePosition } from '@/app/server-handlers/migration'
import {
  MigrationMiniCard,
  MigrationMiniCardType,
} from '@/features/migration/components/MigrationMiniCard/MigrationMiniCard'
import { mapMigrationToPortfolioCard } from '@/features/migration/helpers/map-migration-to-portfolio-card'
import { type MigrationState, MigrationSteps } from '@/features/migration/types'

import classNames from './MigrationFormMigrateStep.module.scss'

interface MigrationFormMigrateStepProps {
  estimatedEarnings: string
  migratablePosition: MigratablePosition
  vault: SDKVaultType | SDKVaultishType
  amount?: BigNumber
  transactionFeeLoading: boolean
  transactionFee?: string
  state: MigrationState
  vaultApy?: number
  isLoadingForecast: boolean
  isQuoteLoading: boolean
}

export const MigrationFormMigrateStep: FC<MigrationFormMigrateStepProps> = ({
  estimatedEarnings,
  migratablePosition,
  vault,
  amount,
  transactionFeeLoading,
  transactionFee,
  state,
  vaultApy,
  isLoadingForecast,
  isQuoteLoading,
}) => {
  const {
    state: { slippageConfig },
  } = useLocalConfig()

  const mockedData = {
    swap: {
      priceImpact: '0.05',
      slippage: '0.05',
    },
  }

  const isVaultAtLeast7dOld = isVaultAtLeastDaysOld({ vault, days: 7 })

  const apr7d = isVaultAtLeast7dOld
    ? formatDecimalAsPercent(new BigNumber(vault.apr7d).div(100))
    : 'New strategy'

  const sourcePositionEstimatedEarningsUSD =
    Number(amount) * Number(vault.inputTokenPriceUSD ?? 0) * Number(migratablePosition.apy)

  const estimatedEarningsUSD = Number(estimatedEarnings) * Number(vault.inputTokenPriceUSD ?? 0)

  const apyDiff =
    (estimatedEarningsUSD - sourcePositionEstimatedEarningsUSD) /
    (Number(amount) * Number(vault.inputTokenPriceUSD ?? 0))

  const { platformLogo } = mapMigrationToPortfolioCard(migratablePosition)

  const withSwap =
    migratablePosition.underlyingTokenAmount.token.symbol.toUpperCase() !==
    vault.inputToken.symbol.toUpperCase()

  return (
    <div className={classNames.migrationFormContentWrapper}>
      <div className={classNames.migrationMiniCardWrapper}>
        <MigrationMiniCard
          description="Passive Lending"
          amount={`$${formatFiatBalance(sourcePositionEstimatedEarningsUSD)}`}
          token={migratablePosition.underlyingTokenAmount.token.symbol as TokenSymbolsList}
          type={MigrationMiniCardType.FROM}
          chainId={migratablePosition.chainId}
          platformLogo={platformLogo}
          isLoading={isQuoteLoading}
        />
        <MigrationMiniCard
          description="Lazy Summer"
          amount={`$${formatFiatBalance(estimatedEarningsUSD)}`}
          change={formatDecimalAsPercent(apyDiff, { plus: true })}
          token={vault.inputToken.symbol as TokenSymbolsList}
          type={MigrationMiniCardType.TO}
          chainId={subgraphNetworkToSDKId(vault.protocol.network)}
          platformLogo="summer"
          isLoading={isLoadingForecast || isQuoteLoading}
        />
        <div className={classNames.migrationMiniCardIcon}>
          <Icon iconName="arrow_forward" size={20} />
        </div>
      </div>
      {apyDiff < 0 && !isLoadingForecast && !isQuoteLoading && (
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
          { label: 'Currenty APY', value: formatDecimalAsPercent(vaultApy ?? 0) },
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
                      value: formatDecimalAsPercent(mockedData.swap.priceImpact),
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
            label: 'Transaction fee',
            value:
              transactionFeeLoading || state.step === MigrationSteps.INIT ? (
                <SkeletonLine width="80px" height="14px" />
              ) : transactionFee ? (
                `$${formatFiatBalance(transactionFee)}`
              ) : (
                'n/a'
              ),
            tooltip: 'Estimated transaction fee for this operation',
          },
        ]}
      />
    </div>
  )
}

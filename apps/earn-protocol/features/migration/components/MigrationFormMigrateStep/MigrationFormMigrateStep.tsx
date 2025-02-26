import { type FC } from 'react'
import {
  Card,
  Icon,
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
import { type BigNumber } from 'bignumber.js'

import { type MigratablePosition } from '@/app/server-handlers/migration'
import { MigrationMiniCard } from '@/features/migration/components/MigrationMiniCard/MigrationMiniCard'
import { type MigrationState, MigrationSteps } from '@/features/migration/types'

import classNames from './MigrationFormMigrateStep.module.scss'

interface MigrationFormMigrateStepProps {
  estimatedEarnings: string
  migratablePosition: MigratablePosition
  vault: SDKVaultType | SDKVaultishType
  rawToTokenAmount?: BigNumber
  transactionFeeLoading: boolean
  transactionFee?: string
  state: MigrationState
}

export const MigrationFormMigrateStep: FC<MigrationFormMigrateStepProps> = ({
  estimatedEarnings,
  migratablePosition,
  vault,
  rawToTokenAmount,
  transactionFeeLoading,
  transactionFee,
  state,
}) => {
  const {
    state: { slippageConfig },
  } = useLocalConfig()

  const mockedData = {
    '30dApy': '0.05',
    currentyApy: '0.05',
    protocol: 'Lazy Summer',
    swap: {
      priceImpact: '0.05',
      slippage: '0.05',
    },
    transactionFee: '0.05',
  }

  return (
    <div className={classNames.migrationFormContentWrapper}>
      <div className={classNames.migrationMiniCardWrapper}>
        <MigrationMiniCard
          description="Passive Lending"
          amount={`$${formatFiatBalance(estimatedEarnings)}`}
          token={migratablePosition.underlyingTokenAmount.token.symbol as TokenSymbolsList}
          type="from"
          chainId={migratablePosition.chainId}
          platformLogo="aave"
        />
        <MigrationMiniCard
          description="Lazy Summer"
          amount={`$${formatFiatBalance(estimatedEarnings)}`}
          change={formatDecimalAsPercent(estimatedEarnings, { plus: true })}
          token={vault.inputToken.symbol as TokenSymbolsList}
          type="to"
          chainId={subgraphNetworkToSDKId(vault.protocol.network)}
          platformLogo="summer"
        />
        <div className={classNames.migrationMiniCardIcon}>
          <Icon iconName="arrow_forward" size={20} />
        </div>
      </div>

      <Card variant="cardPrimaryMediumPaddingsColorfulBorder" style={{ flexDirection: 'column' }}>
        <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
          Total Deposited
        </Text>
        <Text
          as="p"
          variant="p1semi"
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-4)' }}
        >
          {rawToTokenAmount ? (
            formatCryptoBalance(rawToTokenAmount)
          ) : (
            <SkeletonLine width="80px" height="14px" />
          )}{' '}
          {vault.inputToken.symbol}
        </Text>
      </Card>
      <OrderInformation
        title="What's changing"
        items={[
          { label: '30d APY', value: formatDecimalAsPercent(mockedData['30dApy']) },
          { label: 'Currenty APY', value: formatDecimalAsPercent(mockedData.currentyApy) },
          { label: 'Protocol', value: mockedData.protocol },
        ]}
      />
      <OrderInformation
        items={[
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
            tooltip: 'Transaction fee',
          },
        ]}
      />
    </div>
  )
}

import { type FC } from 'react'
import {
  getDisplayToken,
  Icon,
  PositionCard,
  Text,
  TokenWithNetworkIcon,
} from '@summerfi/app-earn-ui'
import { formatCryptoBalance, formatDecimalAsPercent, formatFiatBalance } from '@summerfi/app-utils'

import { type MigratablePosition } from '@/app/server-handlers/raw-calls/migration'
import { mapMigrationToPortfolioCard } from '@/features/migration/helpers/map-migration-to-portfolio-card'
import { type MigrationEarningsData } from '@/features/migration/types'
import { platformLogoMap } from '@/helpers/platform-logo-map'

import classNames from './MigrationPositionCard.module.css'

interface MigrationPositionCardProps {
  migratablePosition: MigratablePosition
  selectedPosition: string | undefined
  handleSelectPosition: (id: string) => void
  earningsData: MigrationEarningsData
}

export const MigrationPositionCard: FC<MigrationPositionCardProps> = ({
  migratablePosition,
  selectedPosition,
  handleSelectPosition,
  earningsData,
}) => {
  const { id, platformLogo, token, depositAmount, chainId } =
    mapMigrationToPortfolioCard(migratablePosition)

  const hasNeededData =
    !!migratablePosition.apy7d && !!migratablePosition.apy && !!earningsData.lazySummer7dApy

  const missingOutAmount =
    Number(migratablePosition.usdValue.amount) *
    (Number(earningsData.lazySummerCurrentApy) - Number(migratablePosition.apy))

  const yes = (
    <Text
      variant="p3semi"
      style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-4)' }}
    >
      Yes <Icon iconName="checkmark_colorful_slim" size={16} />
    </Text>
  )
  const list =
    !!migratablePosition.apy7d && !!migratablePosition.apy && !!earningsData.lazySummer7dApy
      ? [
          {
            label: 'Current 7d APY',
            value: formatDecimalAsPercent(migratablePosition.apy7d),
          },
          {
            label: 'Lazy Summer 7d APY',
            value: formatDecimalAsPercent(earningsData.lazySummer7dApy),
          },
          {
            label: '7d APY Differential',
            value: formatDecimalAsPercent(earningsData.lazySummer7dApy - migratablePosition.apy7d, {
              plus: true,
            }),
          },
        ]
      : [
          {
            label: 'Best quality yields',
            value: yes,
          },
          {
            label: 'Curated protocols',
            value: yes,
          },
          {
            label: 'Automated rebalancing',
            value: yes,
          },
        ]

  return (
    <PositionCard
      key={id}
      isActive={selectedPosition === id}
      platformLogo={platformLogoMap[platformLogo]}
      title={{
        label: `${getDisplayToken(token)} Deposit`,
        value: (
          <div className={classNames.migrationIconWrapper}>
            <TokenWithNetworkIcon tokenName={token} variant="small" chainId={chainId} />
            <Text variant="p3semi">{formatCryptoBalance(depositAmount)}</Text>
          </div>
        ),
      }}
      list={list}
      handleClick={() => handleSelectPosition(id)}
      banner={
        hasNeededData ? (
          <Text variant="p3semi">
            You&apos;re missing out on{' '}
            <Text
              as="span"
              variant="p3semiColorful"
              style={{ color: 'var(--earn-protocol-primary-100)' }}
            >
              ${formatFiatBalance(missingOutAmount)}/Year
            </Text>
          </Text>
        ) : undefined
      }
      listHeading={
        hasNeededData ? undefined : (
          <div className={classNames.listHeadingWrapper}>
            <Text variant="p2semiColorful" style={{ textAlign: 'center' }}>
              Migrate to Lazy summer for...
            </Text>
          </div>
        )
      }
    />
  )
}

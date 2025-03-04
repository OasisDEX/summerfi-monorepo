import { type FC } from 'react'
import { PositionCard, Text, TokenWithNetworkIcon } from '@summerfi/app-earn-ui'
import { formatCryptoBalance, formatDecimalAsPercent } from '@summerfi/app-utils'

import { type MigratablePosition } from '@/app/server-handlers/migration'
import { mapMigrationToPortfolioCard } from '@/features/migration/helpers/map-migration-to-portfolio-card'
import { type MigrationEarningsData } from '@/features/migration/types'
import { platformLogoMap } from '@/helpers/platform-logo-map'

import classNames from './MigrationPositionCard.module.scss'

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

  return (
    <PositionCard
      key={id}
      isActive={selectedPosition === id}
      platformLogo={platformLogoMap[platformLogo]}
      title={{
        label: `${token} Deposit`,
        value: (
          <div className={classNames.migrationIconWrapper}>
            <TokenWithNetworkIcon tokenName={token} variant="small" chainId={chainId} />
            <Text variant="p3semi">{formatCryptoBalance(depositAmount)}</Text>
          </div>
        ),
      }}
      list={[
        {
          label: 'Lazy SummerCurrent APY',
          value: formatDecimalAsPercent(earningsData.lazySummerCurrentApy),
        },
        {
          label: 'Lazy Summer 30d APY',
          value: formatDecimalAsPercent(earningsData.lazySummer30dApy),
        },
        // {
        //   label: '30d APY Differential',
        //   value: formatDecimalAsPercent(thirtydApyDifferential),
        // },
      ]}
      handleClick={() => handleSelectPosition(id)}
      // banner={
      //   <Text variant="p3semi">
      //     You&apos;re missing out on{' '}
      //     <Text
      //       as="span"
      //       variant="p3semiColorful"
      //       style={{ color: 'var(--earn-protocol-primary-100)' }}
      //     >
      //       ${formatFiatBalance(missingOutAmount)}/Year
      //     </Text>
      //   </Text>
      // }
    />
  )
}

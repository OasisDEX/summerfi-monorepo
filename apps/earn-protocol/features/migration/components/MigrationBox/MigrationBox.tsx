import { type FC, useState } from 'react'
import { Card, Expander, Icon, PositionCard, Text } from '@summerfi/app-earn-ui'
import { type PlatformLogo, type TokenSymbolsList } from '@summerfi/app-types'
import { formatCryptoBalance, formatDecimalAsPercent, formatFiatBalance } from '@summerfi/app-utils'
import clsx from 'clsx'

import { platformLogoMap } from '@/helpers/platform-logo-map'

import classNames from './MigrationBox.module.scss'

interface MigrationBoxProps {
  className?: string
  positions: {
    platformLogo: PlatformLogo
    token: TokenSymbolsList
    depositAmount: string
    current30dApy: string
    lazySummer30dApy: string
    thirtydApyDifferential: string
    missingOutAmount: string
  }[]
}

export const MigrationBox: FC<MigrationBoxProps> = ({ className, positions }) => {
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null)

  const handleClick = (index: number) => {
    setSelectedPosition(index)
  }

  return (
    <Card
      variant="cardSecondaryColorfulBorder"
      className={clsx(classNames.migrationBoxWrapper, className)}
    >
      <Expander title={<Text variant="p2semi">Migrate to SummerFi</Text>}>
        <div className={classNames.migrationCardsWrapper}>
          {positions.map((position, index) => (
            <PositionCard
              key={index}
              isActive={selectedPosition === index}
              platformLogo={platformLogoMap[position.platformLogo]}
              title={{
                label: `${position.token} Deposit`,
                value: (
                  <>
                    <Icon tokenName={position.token} size={13} />
                    <Text variant="p3semi">{formatCryptoBalance(position.depositAmount)}</Text>
                  </>
                ),
              }}
              list={[
                {
                  label: 'Current 30d APY',
                  value: formatDecimalAsPercent(position.current30dApy),
                },
                {
                  label: 'Lazy Summer 30d APY',
                  value: formatDecimalAsPercent(position.lazySummer30dApy),
                },
                {
                  label: '30d APY Differential',
                  value: formatDecimalAsPercent(position.thirtydApyDifferential),
                },
              ]}
              handleClick={() => handleClick(index)}
              banner={
                <Text variant="p3semi">
                  You&apos;re missing out on{' '}
                  <Text
                    as="span"
                    variant="p3semiColorful"
                    style={{ color: 'var(--earn-protocol-primary-100)' }}
                  >
                    ${formatFiatBalance(position.missingOutAmount)}/Year
                  </Text>
                </Text>
              }
            />
          ))}
        </div>
      </Expander>
    </Card>
  )
}

import { type FC } from 'react'
import { Card, Expander, PositionCard, Text, TokenWithNetworkIcon } from '@summerfi/app-earn-ui'
import { type PlatformLogo, type TokenSymbolsList } from '@summerfi/app-types'
import { formatCryptoBalance } from '@summerfi/app-utils'
import clsx from 'clsx'

import { platformLogoMap } from '@/helpers/platform-logo-map'

import classNames from './MigrationBox.module.scss'

interface MigrationBoxProps {
  className?: string
  selectedPosition: string | null
  onSelectPosition: (id: string) => void
  positions: {
    id: string
    platformLogo: PlatformLogo
    token: TokenSymbolsList
    depositAmount: string
    chainId: number
    // current30dApy: string
    // lazySummer30dApy: string
    // thirtydApyDifferential: string
    // missingOutAmount: string
  }[]
}

export const MigrationBox: FC<MigrationBoxProps> = ({
  className,
  selectedPosition,
  onSelectPosition,
  positions,
}) => {
  return (
    <Card
      variant="cardSecondaryColorfulBorder"
      className={clsx(classNames.migrationBoxWrapper, className)}
    >
      <Expander title={<Text variant="p2semi">Migrate to SummerFi</Text>}>
        <div className={classNames.migrationCardsWrapper}>
          {positions.map((position) => (
            <PositionCard
              key={position.id}
              isActive={selectedPosition === position.id}
              platformLogo={platformLogoMap[position.platformLogo]}
              title={{
                label: `${position.token} Deposit`,
                value: (
                  <div className={classNames.migrationIconWrapper}>
                    <TokenWithNetworkIcon
                      tokenName={position.token}
                      variant="small"
                      chainId={position.chainId}
                    />
                    <Text variant="p3semi">{formatCryptoBalance(position.depositAmount)}</Text>
                  </div>
                ),
              }}
              list={
                [
                  // {
                  //   label: 'Current 30d APY',
                  //   value: formatDecimalAsPercent(position.current30dApy),
                  // },
                  // {
                  //   label: 'Lazy Summer 30d APY',
                  //   value: formatDecimalAsPercent(position.lazySummer30dApy),
                  // },
                  // {
                  //   label: '30d APY Differential',
                  //   value: formatDecimalAsPercent(position.thirtydApyDifferential),
                  // },
                ]
              }
              handleClick={() => onSelectPosition(position.id)}
              // banner={
              //   <Text variant="p3semi">
              //     You&apos;re missing out on{' '}
              //     <Text
              //       as="span"
              //       variant="p3semiColorful"
              //       style={{ color: 'var(--earn-protocol-primary-100)' }}
              //     >
              //       ${formatFiatBalance(position.missingOutAmount)}/Year
              //     </Text>
              //   </Text>
              // }
            />
          ))}
        </div>
      </Expander>
    </Card>
  )
}

import { type FC } from 'react'
import { Card, Expander, Text } from '@summerfi/app-earn-ui'
import { type PlatformLogo, type TokenSymbolsList } from '@summerfi/app-types'
import clsx from 'clsx'

import { MigrationPositionCard } from '@/features/migration/components/MigrationPositionCard/MigrationPositionCard'

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
            <MigrationPositionCard
              key={position.id}
              {...position}
              selectedPosition={selectedPosition}
              handleSelectPosition={onSelectPosition}
            />
          ))}
        </div>
      </Expander>
    </Card>
  )
}

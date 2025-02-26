import { type FC } from 'react'
import { Card, Expander, Text } from '@summerfi/app-earn-ui'
import clsx from 'clsx'

import { type MigratablePosition } from '@/app/server-handlers/migration'
import { MigrationPositionCard } from '@/features/migration/components/MigrationPositionCard/MigrationPositionCard'
import { mapMigrationToPortfolioCard } from '@/features/migration/helpers/map-migration-to-portfolio-card'

import classNames from './MigrationBox.module.scss'

interface MigrationBoxProps {
  title?: string
  className?: string
  selectedPosition: string | null
  onSelectPosition: (id: string) => void
  migratablePositions: MigratablePosition[]
}

export const MigrationBox: FC<MigrationBoxProps> = ({
  title = 'Migrate to SummerFi',
  className,
  selectedPosition,
  onSelectPosition,
  migratablePositions,
}) => {
  const resolvedMigratablePositions = mapMigrationToPortfolioCard(migratablePositions)

  return (
    <Card
      variant="cardSecondaryColorfulBorder"
      className={clsx(classNames.migrationBoxWrapper, className)}
    >
      <Expander title={<Text variant="p2semi">{title}</Text>}>
        <div className={classNames.migrationCardsWrapper}>
          {resolvedMigratablePositions.map((position) => (
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

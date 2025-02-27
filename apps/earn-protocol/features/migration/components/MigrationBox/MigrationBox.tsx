import { type FC } from 'react'
import { Button, Card, Expander, Text, WithArrow } from '@summerfi/app-earn-ui'
import clsx from 'clsx'
import Link from 'next/link'

import { type MigratablePosition } from '@/app/server-handlers/migration'
import { MigrationPositionCard } from '@/features/migration/components/MigrationPositionCard/MigrationPositionCard'

import classNames from './MigrationBox.module.scss'

interface MigrationBoxProps {
  title?: string
  className?: string
  selectedPosition: string | undefined
  onSelectPosition: (id: string) => void
  migratablePositions: MigratablePosition[]
  ctaLink?: string
}

export const MigrationBox: FC<MigrationBoxProps> = ({
  title = 'Migrate to SummerFi',
  className,
  selectedPosition,
  onSelectPosition,
  migratablePositions,
  ctaLink,
}) => {
  return (
    <Card
      variant="cardSecondaryColorfulBorder"
      className={clsx(classNames.migrationBoxWrapper, className)}
    >
      <Expander title={<Text variant="p2semi">{title}</Text>}>
        <div className={classNames.migrationCardsWrapper}>
          {migratablePositions.map((position) => (
            <MigrationPositionCard
              key={position.id}
              migratablePosition={position}
              selectedPosition={selectedPosition}
              handleSelectPosition={onSelectPosition}
            />
          ))}
        </div>
        {ctaLink && (
          <div className={classNames.migrationBoxCta}>
            <Link href={ctaLink} style={{ width: '100%' }}>
              <Button variant="primaryMediumColorful" style={{ width: '100%' }}>
                <WithArrow style={{ color: 'var(--color-text-primary)' }}>Migrate</WithArrow>
              </Button>
            </Link>
          </div>
        )}
      </Expander>
    </Card>
  )
}

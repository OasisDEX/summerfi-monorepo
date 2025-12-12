import { type FC, useCallback, useState } from 'react'
import { Button, Card, Expander, Text, WithArrow } from '@summerfi/app-earn-ui'
import clsx from 'clsx'
import Link from 'next/link'

import { type MigratablePosition } from '@/app/server-handlers/raw-calls/migration'
import { MigrationPositionCard } from '@/features/migration/components/MigrationPositionCard/MigrationPositionCard'
import { type MigrationEarningsDataByChainId } from '@/features/migration/types'

import classNames from './MigrationBox.module.css'

interface MigrationBoxProps {
  title?: string
  className?: string
  selectedPosition: string | undefined
  onSelectPosition: (id: string) => void
  migratablePositions: MigratablePosition[]
  migrationBestVaultApy: MigrationEarningsDataByChainId
  cta?: {
    link: string
    disabled?: boolean
  }
}

export const MigrationBox: FC<MigrationBoxProps> = ({
  title,
  className,
  selectedPosition,
  onSelectPosition,
  migratablePositions,
  migrationBestVaultApy,
  cta,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleExpand = useCallback((flag: boolean) => {
    setIsExpanded(flag)
  }, [])

  const resolvedTitle =
    title ??
    (isExpanded
      ? 'Select a position to migrate'
      : `${migratablePositions.length} positions available to migrate`)

  return (
    <Card
      variant="cardSecondaryColorfulBorder"
      className={clsx(classNames.migrationBoxWrapper, className)}
    >
      <Expander title={<Text variant="p2semi">{resolvedTitle}</Text>} onExpand={handleExpand}>
        <div className={classNames.migrationCardsWrapper}>
          {migratablePositions.length === 0 && (
            <Text variant="p2" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
              No positions found that can be migrated
            </Text>
          )}
          {migratablePositions.map((position) => (
            <MigrationPositionCard
              key={position.id}
              migratablePosition={position}
              selectedPosition={selectedPosition}
              handleSelectPosition={onSelectPosition}
              earningsData={migrationBestVaultApy[position.chainId]}
            />
          ))}
        </div>
        {cta && (
          <div className={classNames.migrationBoxCta}>
            <Link href={cta.link} style={{ width: '100%' }} prefetch>
              <Button
                variant="primaryMediumColorful"
                style={{ width: '100%' }}
                disabled={cta.disabled}
              >
                <WithArrow style={{ color: 'var(--color-text-primary)' }}>Migrate</WithArrow>
              </Button>
            </Link>
          </div>
        )}
      </Expander>
    </Card>
  )
}

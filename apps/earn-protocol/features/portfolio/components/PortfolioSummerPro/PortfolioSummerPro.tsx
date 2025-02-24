import { type FC, useState } from 'react'
import { Button, Card, SlideCarousel, TabBar, Text, WithArrow } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { type MigratablePosition } from '@/app/server-handlers/migration'
import { MigrationPositionCard } from '@/features/migration/components/MigrationPositionCard/MigrationPositionCard'
import { mapMigrationToPortfolioCard } from '@/features/migration/helpers/map-migration-to-portfolio-card'

import classNames from './PortfolioSummerPro.module.scss'

interface PortfolioSummerProProps {
  walletAddress: string
  migratablePositions: MigratablePosition[]
}

export const PortfolioSummerPro: FC<PortfolioSummerProProps> = ({
  walletAddress,
  migratablePositions,
}) => {
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null)

  const handleSelectPosition = (id: string) => {
    setSelectedPosition(id)
  }

  const resolvedMigratablePositions = mapMigrationToPortfolioCard(migratablePositions)

  return (
    <Card variant="cardSecondary" className={classNames.portfolioSummerProWrapper}>
      <Text variant="h5" as="h5">
        Summer.fi Pro Positions
      </Text>
      <TabBar
        tabs={[
          {
            id: 'all',
            label: 'All',
            content: <div>All</div>,
          },
          {
            id: 'migration',
            label: `Available to migrate (${migratablePositions.length})`,
            content: (
              <div className={classNames.migrateTabWrapper}>
                <SlideCarousel
                  slides={resolvedMigratablePositions.map((position) => (
                    <MigrationPositionCard
                      key={position.id}
                      {...position}
                      selectedPosition={selectedPosition}
                      handleSelectPosition={handleSelectPosition}
                    />
                  ))}
                  options={{ slidesToScroll: 'auto' }}
                />
                <div className={classNames.buttonWrapper}>
                  <Link href={`/migrate/user/${walletAddress}?positionId=${selectedPosition}`}>
                    <Button
                      variant="primarySmall"
                      style={{ paddingRight: 'var(--general-space-32)' }}
                      disabled={!selectedPosition}
                    >
                      <WithArrow style={{ color: 'var(--earn-protocol-secondary-100)' }}>
                        Migrate
                      </WithArrow>
                    </Button>
                  </Link>
                </div>
              </div>
            ),
          },
        ]}
      />
    </Card>
  )
}

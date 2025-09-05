import { type FC, useState } from 'react'
import {
  Button,
  Card,
  SlideCarousel,
  SliderCarouselDotsPosition,
  TabBar,
  Text,
  useMobileCheck,
  WithArrow,
} from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { type MigratablePosition } from '@/app/server-handlers/migration'
import { MigrationPositionCard } from '@/features/migration/components/MigrationPositionCard/MigrationPositionCard'
import { type MigrationEarningsDataByChainId } from '@/features/migration/types'
import { useHandleButtonClickEvent } from '@/hooks/use-mixpanel-event'

import classNames from './PortfolioSummerPro.module.css'

interface PortfolioSummerProProps {
  walletAddress: string
  migratablePositions: MigratablePosition[]
  migrationBestVaultApy: MigrationEarningsDataByChainId
  carouselId: string
}

export const PortfolioSummerPro: FC<PortfolioSummerProProps> = ({
  walletAddress,
  migratablePositions,
  migrationBestVaultApy,
  carouselId,
}) => {
  const { isMobile } = useMobileCheck()
  const buttonClickEventHandler = useHandleButtonClickEvent()

  const [selectedPosition, setSelectedPosition] = useState<string>()

  const handleSelectPosition = (id: string) => {
    buttonClickEventHandler(`${carouselId}-vault-${id}-click`)
    setSelectedPosition(id)
  }

  return (
    <Card variant="cardSecondary" className={classNames.portfolioSummerProWrapper}>
      <div className={classNames.portfolioSummerProHeader}>
        <Text variant="h5" as="h5">
          Migrate to Lazy Summer
        </Text>
        <div id="portal-embla-buttons" />
      </div>
      <TabBar
        tabs={[
          {
            id: 'migration',
            label: `Available to migrate (${migratablePositions.length})`,
            content: (
              <div className={classNames.migrateTabWrapper}>
                {migratablePositions.length === 0 && (
                  <Text variant="p2" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
                    No positions found that can be migrated
                  </Text>
                )}
                {migratablePositions.length > 0 && (
                  <SlideCarousel
                    withDots={isMobile}
                    dotsPosition={SliderCarouselDotsPosition.BOTTOM}
                    slides={migratablePositions.map((position) => (
                      <MigrationPositionCard
                        key={position.id}
                        migratablePosition={position}
                        selectedPosition={selectedPosition}
                        handleSelectPosition={handleSelectPosition}
                        earningsData={migrationBestVaultApy[position.chainId]}
                      />
                    ))}
                    portalElementId="portal-embla-buttons"
                    handleButtonClick={buttonClickEventHandler}
                    carouselId={carouselId}
                    options={{ slidesToScroll: 'auto' }}
                  />
                )}
                <div className={classNames.buttonWrapper}>
                  <Link
                    href={`/migrate/user/${walletAddress}?positionId=${selectedPosition}`}
                    onClick={() => {
                      buttonClickEventHandler(`${carouselId}-migrate-${selectedPosition}-click`)
                    }}
                  >
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

import { type CSSProperties, type FC } from 'react'
import { Icon, SlideCarousel, StrategyCard, Text } from '@summerfi/app-earn-ui'
import { type SDKVaultsListType } from '@summerfi/app-types'

interface PortfolioStrategiesCarouselProps {
  style?: CSSProperties
  className?: string
  strategiesList: SDKVaultsListType
}

export const PortfolioStrategiesCarousel: FC<PortfolioStrategiesCarouselProps> = ({
  style,
  className,
  strategiesList,
}) => {
  return (
    <div style={{ width: '100%', ...style }} className={className}>
      <SlideCarousel
        slides={strategiesList.map((strategy) => (
          <StrategyCard
            key={strategy.id}
            {...strategy}
            secondary
            withHover
            // eslint-disable-next-line no-console
            onClick={(item) => console.log('strategy clicked', item)}
          />
        ))}
        options={{ slidesToScroll: 'auto' }}
        title={
          <div style={{ display: 'flex', gap: 'var(--general-space-8)', alignItems: 'center' }}>
            <Icon iconName="stars" variant="s" color="rgba(255, 251, 253, 1)" />
            <Text as="p" variant="p3semi">
              You might like
            </Text>
          </div>
        }
      />
    </div>
  )
}

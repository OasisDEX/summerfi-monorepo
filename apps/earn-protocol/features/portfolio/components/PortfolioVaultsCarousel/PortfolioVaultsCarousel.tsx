import { type CSSProperties, type FC } from 'react'
import { Icon, SlideCarousel, Text, VaultCard } from '@summerfi/app-earn-ui'
import { type SDKVaultsListType } from '@summerfi/app-types'

interface PortfolioVaultsCarouselProps {
  style?: CSSProperties
  className?: string
  vaultsList: SDKVaultsListType
}

export const PortfolioVaultsCarousel: FC<PortfolioVaultsCarouselProps> = ({
  style,
  className,
  vaultsList,
}) => {
  return (
    <div style={{ width: '100%', ...style }} className={className}>
      <SlideCarousel
        slides={vaultsList.map((vault) => (
          <VaultCard
            key={vault.id}
            {...vault}
            secondary
            withHover
            // eslint-disable-next-line no-console
            onClick={(item) => console.log('vault clicked', item)}
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

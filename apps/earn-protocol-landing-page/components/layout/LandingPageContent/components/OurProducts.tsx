import { Text } from '@summerfi/app-earn-ui'

import { OurProductsList } from '@/components/layout/LandingPageContent/components/OurProductsList'

export const OurProducts = () => {
  return (
    <>
      <Text
        variant="h3"
        style={{
          marginTop: 'var(--spacing-space-3x-large)',
        }}
      >
        Our products
      </Text>
      <Text
        variant="p1"
        style={{
          marginBottom: 'var(--spacing-space-large)',
          color: 'var(--color-text-secondary)',
        }}
      >
        Capture optimized yield, unlock RWA private markets, and launch custom vaults - backed by
        institutional-grade risk and infrastructure
      </Text>
      <OurProductsList />
    </>
  )
}

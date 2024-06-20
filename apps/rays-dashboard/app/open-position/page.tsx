import { CountDownBanner, INTERNAL_LINKS, ProxyLinkComponent, Text } from '@summerfi/app-ui'
import Link from 'next/link'

import { ProductPicker } from '@/components/organisms/ProductPicker/ProductPicker'
import systemConfigHandler from '@/server-handlers/system-config'

export default async function OpenPositionPage() {
  const futureTimestamp = '2024-06-27T00:00:00'
  const systemConfig = await systemConfigHandler()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 'var(--space-xxl)',
      }}
    >
      <Text
        as="h2"
        variant="h2"
        style={{ marginTop: 'var(--space-xxl)', marginBottom: 'var(--space-xl)' }}
      >
        Earn $RAYS by opening a position
      </Text>
      <CountDownBanner futureTimestamp={futureTimestamp} />
      <ProductPicker
        products={systemConfig.configRays.products}
        productHub={systemConfig.productHub.table}
      />
      <Text as="p" variant="p1semi" style={{ marginTop: 'var(--space-m)' }}>
        <Link passHref legacyBehavior prefetch={false} href={INTERNAL_LINKS.earn} target="_blank">
          <ProxyLinkComponent>
            → Explore over 50+ positions with major protocols and collateral types supports
          </ProxyLinkComponent>
        </Link>
      </Text>
    </div>
  )
}

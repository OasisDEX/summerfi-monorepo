import { CountDownBanner, Dial, INTERNAL_LINKS, ProxyLinkComponent, Text } from '@summerfi/app-ui'
import BigNumber from 'bignumber.js'
import Link from 'next/link'

import { ProductPicker } from '@/components/organisms/ProductPicker/ProductPicker'
import { formatAsShorthandNumbers } from '@/helpers/formatters'
import { fetchRays } from '@/server-handlers/rays'
import systemConfigHandler from '@/server-handlers/system-config'

interface OpenPositionPageProps {
  searchParams: {
    userAddress: string
  }
}

export default async function OpenPositionPage({ searchParams }: OpenPositionPageProps) {
  const futureTimestamp = '2024-06-27T00:00:00'
  const systemConfig = await systemConfigHandler()
  const { userAddress } = searchParams

  const userRays = await fetchRays({ address: userAddress })

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 'var(--space-xxl)',
      }}
    >
      {!!userRays.rays?.allPossiblePoints && (
        <Dial
          value={0}
          max={userRays.rays.allPossiblePoints * 5}
          formatter={(value) => {
            if (value >= 10000) {
              return formatAsShorthandNumbers(new BigNumber(value.toFixed(0)), 0)
            }

            return value.toFixed(0)
          }}
          subtext="Elligible"
          icon="rays"
        />
      )}
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
        <Link passHref legacyBehavior prefetch={false} href={INTERNAL_LINKS.earn}>
          <ProxyLinkComponent target="_blank">
            Explore over 50+ positions with major protocols and collateral types supports →
          </ProxyLinkComponent>
        </Link>
      </Text>
    </div>
  )
}

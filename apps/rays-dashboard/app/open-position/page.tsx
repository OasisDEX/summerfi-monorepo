import {
  CountDownBanner,
  Dial,
  INTERNAL_LINKS,
  ProxyLinkComponent,
  Text,
  WithArrow,
} from '@summerfi/app-ui'
import BigNumber from 'bignumber.js'

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
      <ProxyLinkComponent
        target="_blank"
        href={INTERNAL_LINKS.earn}
        style={{ marginTop: 'var(--space-m)' }}
      >
        <WithArrow gap={0} variant="p1semi">
          Explore over 50+ positions with major protocols and collateral types supports
        </WithArrow>
      </ProxyLinkComponent>
    </div>
  )
}

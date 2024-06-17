import { CountDownBanner, Text } from '@summerfi/app-ui'
import Link from 'next/link'

import { automationItems, ProductCard } from '@/components/molecules/ProductCard/ProductCard'
import { NetworkNames } from '@/constants/networks-list'
import { LendingProtocol } from '@/helpers/lending-protocol'
import { lendingProtocolsByName } from '@/helpers/lending-protocols-configs'

export default function OpenPositionPage() {
  const aaveV3Config = lendingProtocolsByName[LendingProtocol.AaveV3]
  const futureTimestamp = '2024-12-25T00:00:00'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Text
        as="h2"
        variant="h2"
        style={{ marginTop: 'var(--space-xxl)', marginBottom: 'var(--space-xl)' }}
      >
        Earn $RAYS by opening a position
      </Text>
      <CountDownBanner futureTimestamp={futureTimestamp} />
      <ProductCard
        automation={automationItems}
        protocolConfig={aaveV3Config}
        tokens={['ETH', 'DAI']}
        network={NetworkNames.baseMainnet}
        btn={{
          link: '/',
          label: 'Earn xxx Rays for every Automation you add',
        }}
      />

      <Text as="p" variant="p1semi" style={{ marginTop: 'var(--space-m)' }}>
        <Link href="/">
          → Explore over 50+ positions with major protocols and collateral types supports
        </Link>
      </Text>
    </div>
  )
}

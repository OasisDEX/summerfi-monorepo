import { Text } from '@summerfi/app-earn-ui'

import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import {
  BigGradientBox,
  EffortlessAccessBlock,
  HigherYieldsBlock,
  LandingPageHero,
  MarketingPoints,
  ProtocolScroller,
  SupportedNetworksList,
} from '@/components/layout/LandingPageContent'

export const revalidate = 60

export default async function HomePage() {
  const { vaults } = await getVaultsList()

  return (
    <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', alignItems: 'center' }}>
      <LandingPageHero vaultsList={vaults} />
      <BigGradientBox>
        <EffortlessAccessBlock />
        <SupportedNetworksList />
      </BigGradientBox>
      <ProtocolScroller
        protocolsList={[
          // TODO: Replace with real data
          { protocol: 'Spark', protocolIcon: 'spark_circle_color', url: '#', tvl: '1.2B' },
          { protocol: 'Aave', protocolIcon: 'aave_circle_color', url: '#', tvl: '1.2B' },
          { protocol: 'Maker', protocolIcon: 'maker_circle_color', url: '#', tvl: '1.2B' },
          { protocol: 'Compound', protocolIcon: 'compound_circle_color', url: '#', tvl: '1.2B' },
          { protocol: 'Ajna', protocolIcon: 'ajna_circle_color', url: '#', tvl: '1.2B' },
        ]}
      />
      <MarketingPoints>
        <HigherYieldsBlock />
        <div>
          <Text variant="h2">Enhanced risk management with time-saving automation.</Text>
        </div>
        <div>
          <Text variant="h2">The very best of Decentralised Finance (DeFi)</Text>
        </div>
        <div>
          <Text variant="h2">The $SUMR Token</Text>
        </div>
        <div>
          <Text variant="h2">Start earning now</Text>
        </div>
        <div>
          <Text variant="h2">
            Summer.fi Pro, advanced DeFi features all in one app, just a click away.
          </Text>
        </div>
        <div>
          <Text variant="h2">Send, swap, bridge, buy and cash out, all in one app.</Text>
        </div>
        <div>
          <Text variant="h2">Top tier security & audits</Text>
        </div>
        <div>
          <Text variant="h2">Built by Summer.fi, DeFi’s most trusted frontend app.</Text>
        </div>
        <div>
          <Text variant="h2">FAQ</Text>
        </div>
      </MarketingPoints>
    </div>
  )
}

import { BigGradientBox, Text } from '@summerfi/app-earn-ui'

import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import {
  EffortlessAccessBlock,
  EnhancedRiskManagement,
  HigherYieldsBlock,
  LandingPageHero,
  MarketingPoints,
  ProtocolScroller,
  SupportedNetworksList,
} from '@/components/layout/LandingPageContent'
import { BestOfDecentralizedFinance } from '@/components/layout/LandingPageContent/content/BestOfDecentralisedFinance'
import { StartEarningNow } from '@/components/layout/LandingPageContent/content/StartEarningNow'
import { SumrToken } from '@/components/layout/LandingPageContent/content/SumrToken'

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
          { protocol: 'Maker', protocolIcon: 'maker_circle_color', url: '#', tvl: '1.2B' },
          { protocol: 'Aave', protocolIcon: 'aave_circle_color', url: '#', tvl: '1.2B' },
          { protocol: 'Compound', protocolIcon: 'compound_circle_color', url: '#', tvl: '1.2B' },
          { protocol: 'Ajna', protocolIcon: 'ajna_circle_color', url: '#', tvl: '1.2B' },
        ]}
      />
      <MarketingPoints>
        <HigherYieldsBlock />
        <EnhancedRiskManagement protectedCapital="10B" />
        <BestOfDecentralizedFinance />
        <SumrToken />
        <StartEarningNow />
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

import { BigGradientBox } from '@summerfi/app-earn-ui'
import { parseServerResponseToClient } from '@summerfi/app-utils'

import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import systemConfigHandler from '@/app/server-handlers/system-config'
import {
  EffortlessAccessBlock,
  EnhancedRiskManagement,
  HigherYieldsBlock,
  LandingPageHero,
  MarketingPoints,
  ProtocolScroller,
  SupportedNetworksList,
} from '@/components/layout/LandingPageContent'
import { Audits } from '@/components/layout/LandingPageContent/content/Audits'
import { BestOfDecentralizedFinance } from '@/components/layout/LandingPageContent/content/BestOfDecentralisedFinance'
import { BuildBySummerFi } from '@/components/layout/LandingPageContent/content/BuildBySummerFi'
import { CryptoUtilities } from '@/components/layout/LandingPageContent/content/CryptoUtilities'
import { LandingFaqSection } from '@/components/layout/LandingPageContent/content/LandingFaqSection'
import { StartEarningNow } from '@/components/layout/LandingPageContent/content/StartEarningNow'
import { SummerFiProSection } from '@/components/layout/LandingPageContent/content/SummerFiProSection'
import { SumrToken } from '@/components/layout/LandingPageContent/content/SumrToken'
import { decorateCustomVaultFields } from '@/helpers/vault-custom-value-helpers'

export const revalidate = 60

export default async function HomePage() {
  const [{ vaults }, systemConfig] = await Promise.all([getVaultsList(), systemConfigHandler()])

  const { config } = parseServerResponseToClient(systemConfig)
  const vaultsDecorated = decorateCustomVaultFields(vaults, config)

  return (
    <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', alignItems: 'center' }}>
      <LandingPageHero vaultsList={vaultsDecorated} />
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
        <EnhancedRiskManagement protectedCapital="10B" />
        <BestOfDecentralizedFinance />
        <SumrToken />
        <StartEarningNow />
        <SummerFiProSection />
        <CryptoUtilities />
        <Audits />
        <BuildBySummerFi />
        <LandingFaqSection />
      </MarketingPoints>
    </div>
  )
}

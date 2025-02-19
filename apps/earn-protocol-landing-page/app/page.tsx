import { BigGradientBox, HighestQualityYieldsDisclaimer } from '@summerfi/app-earn-ui'
import { type IconNamesList, type SDKNetwork } from '@summerfi/app-types'
import { aggregateArksPerNetwork, parseServerResponseToClient } from '@summerfi/app-utils'

import { getProtocolTvl } from '@/app/server-handlers/defillama/get-protocol-tvl'
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

import { getInterestRates } from './server-handlers/interest-rates'

export const revalidate = 60

type SupportedTvlProtocols =
  | 'aave'
  | 'sky'
  | 'spark'
  | 'pendle'
  | 'gearbox'
  | 'euler'
  | 'compound'
  | 'ethena'
  | 'fluid'

const supportedProtocolsConfig: {
  [key in SupportedTvlProtocols]: {
    displayName: string
    defillamaProtocolName: string
    icon: IconNamesList
  }
} = {
  aave: {
    displayName: 'Aave',
    defillamaProtocolName: 'aave',
    icon: 'scroller_aave',
  },
  sky: {
    displayName: 'Sky',
    defillamaProtocolName: 'maker',
    icon: 'scroller_sky',
  },
  spark: {
    displayName: 'Spark',
    defillamaProtocolName: 'spark',
    icon: 'scroller_spark',
  },
  pendle: {
    displayName: 'Pendle',
    defillamaProtocolName: 'pendle',
    icon: 'scroller_pendle',
  },
  gearbox: {
    displayName: 'Gearbox',
    defillamaProtocolName: 'gearbox',
    icon: 'scroller_gearbox',
  },
  euler: {
    displayName: 'Euler',
    defillamaProtocolName: 'euler',
    icon: 'scroller_euler',
  },
  compound: {
    displayName: 'Compound',
    defillamaProtocolName: 'compound-v3',
    icon: 'scroller_compound',
  },
  ethena: {
    displayName: 'Ethena',
    defillamaProtocolName: 'ethena',
    icon: 'scroller_ethena',
  },
  fluid: {
    displayName: 'Fluid',
    defillamaProtocolName: 'fluid-lending',
    icon: 'scroller_fluid',
  },
}

const supportedProtocols = Object.keys(
  supportedProtocolsConfig,
) as (keyof typeof supportedProtocolsConfig)[]

const emptyTvls = {
  aave: 0n,
  sky: 0n,
  spark: 0n,
  pendle: 0n,
  gearbox: 0n,
  euler: 0n,
  compound: 0n,
  ethena: 0n,
  fluid: 0n,
}

export default async function HomePage() {
  const [{ vaults }, systemConfig, ...protocolTvlsArray] = await Promise.all([
    getVaultsList(),
    systemConfigHandler(),
    ...supportedProtocols.map((protocol) => {
      return getProtocolTvl(
        supportedProtocolsConfig[protocol as keyof typeof supportedProtocolsConfig]
          .defillamaProtocolName,
        protocol,
      )
    }),
  ])

  const protocolTvls = protocolTvlsArray.reduce<{
    [key in SupportedTvlProtocols]: bigint
  }>((acc, curr) => ({ ...acc, ...curr }), emptyTvls)

  const { config } = parseServerResponseToClient(systemConfig)

  const aggregatedArksPerNetwork = aggregateArksPerNetwork(vaults)

  const interestRatesPromises = Object.entries(aggregatedArksPerNetwork).map(
    ([network, { arks }]) =>
      getInterestRates({
        network: network as SDKNetwork,
        arksList: arks,
        justLatestRates: true,
      }),
  )

  const interestRatesResults = await Promise.all(interestRatesPromises)

  const vaultsDecorated = decorateCustomVaultFields({
    vaults,
    systemConfig: config,
    decorators: {
      arkInterestRatesMap: interestRatesResults.reduce((acc, curr) => {
        return { ...acc, ...curr }
      }, {}),
    },
  })

  return (
    <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', alignItems: 'center' }}>
      <LandingPageHero vaultsList={vaultsDecorated} />
      <BigGradientBox>
        <EffortlessAccessBlock />
        <SupportedNetworksList />
      </BigGradientBox>
      <ProtocolScroller
        protocolsList={supportedProtocols.map((protocol) => {
          const protocolConfig = supportedProtocolsConfig[protocol]

          return {
            protocol: protocolConfig.displayName,
            protocolIcon: supportedProtocolsConfig[protocol].icon,
            tvl: protocolTvls[protocol],
            url: '',
          }
        })}
      />
      <MarketingPoints>
        <HigherYieldsBlock vaultsList={vaultsDecorated} />
        <EnhancedRiskManagement protectedCapital="$10B+" />
        <BestOfDecentralizedFinance />
        <SumrToken />
        <StartEarningNow />
        <SummerFiProSection />
        <CryptoUtilities />
        <Audits />
        <BuildBySummerFi />
        <LandingFaqSection />
        <HighestQualityYieldsDisclaimer />
      </MarketingPoints>
    </div>
  )
}

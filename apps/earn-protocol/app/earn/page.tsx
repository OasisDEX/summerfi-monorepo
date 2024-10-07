import { DataBlock, SimpleGrid, StrategyCard, StrategyGrid } from '@summerfi/app-earn-ui'
import { NetworkNames, type Risk, type TokenSymbolsList } from '@summerfi/app-types'
import Link from 'next/link'

import FormContainer from '@/components/organisms/Form/FormContainer'
import { strategiesList } from '@/constants/dev-strategies-list'
import type { FleetConfig } from '@/helpers/sdk/types'

const fleetConfig: FleetConfig = {
  tokenSymbol: 'USDC',
  fleetAddress: '0x75d4f7cb1b2481385e0878c639f6f6d66592d399',
}

const getStrategyLink = (strategy: (typeof strategiesList)[number]) => {
  return `/earn/${strategy.id}-${strategy.symbol}-${strategy.network}-${strategy.apy}-${strategy.risk}`
}

const EarnPage = () => {
  return (
    <StrategyGrid
      network={NetworkNames.ethereumMainnet}
      topContent={
        <SimpleGrid columns={3} style={{ justifyItems: 'stretch' }} gap={170}>
          <DataBlock
            title="Total Assets"
            titleTooltip="Tooltip about assets or something"
            size="large"
            value="$800,130,321"
          />
          <DataBlock
            title="Total Assets"
            titleTooltip="Tooltip about assets or something"
            size="large"
            value="14.3b"
          />
          <DataBlock
            title="Total Assets"
            titleTooltip="Tooltip about assets or something"
            size="large"
            value="6"
          />
        </SimpleGrid>
      }
      leftContent={strategiesList.map((strategy) => (
        <Link key={strategy.id} href={getStrategyLink(strategy)}>
          <StrategyCard {...strategy} secondary />
        </Link>
      ))}
      rightContent={<FormContainer fleetConfig={fleetConfig} />}
    />
  )
}

export default EarnPage

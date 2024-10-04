import { DataBlock, SimpleGrid, StrategyGrid } from '@summerfi/app-earn-ui'

import FormContainer from '@/components/organisms/Form/FormContainer'
import type { FleetConfig } from '@/helpers/sdk/types'

const fleetConfig: FleetConfig = {
  tokenSymbol: 'USDC',
  fleetAddress: '0x75d4f7cb1b2481385e0878c639f6f6d66592d399',
}

const EarnPage = () => {
  return (
    <StrategyGrid
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
      leftContent={
        <div>
          <p>Left Content</p>
          <p>Left Content</p>
          <p>Left Content</p>
          <p>Left Content</p>
          <p>Left Content</p>
          <p>Left Content</p>
          <p>Left Content</p>
          <p>Left Content</p>
          <p>Left Content</p>
          <p>Left Content</p>
        </div>
      }
      rightContent={<FormContainer fleetConfig={fleetConfig} />}
    />
  )
}

export default EarnPage

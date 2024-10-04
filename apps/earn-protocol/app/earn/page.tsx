import React from 'react'
import { StrategyGrid } from '@summerfi/app-earn-ui'

import FormContainer from '@/components/organisms/Form/FormContainer'
import type { FleetConfig } from '@/helpers/sdk/types'

const fleetConfig: FleetConfig = {
  tokenSymbol: 'USDC',
  fleetAddress: '0x75d4f7cb1b2481385e0878c639f6f6d66592d399',
}

const EarnPage = () => {
  return (
    <StrategyGrid
      topContent={<p>Top Content</p>}
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

'use client'
import { Card } from '@summerfi/app-earn-ui'

import { StrategyDetailsHowItWorks } from '@/components/organisms/StrategyDetailsHowItWorks/StrategyDetailsHowItWorks'

export const StrategyDetailsView = () => {
  return (
    <>
      <StrategyDetailsHowItWorks />
      <div id="advanced-yield-data">
        <Card variant="cardPrimary">
          <div style={{ margin: '500px' }}>Advanced yield</div>
        </Card>
      </div>
      <div id="yield-sources">
        <Card variant="cardPrimary">
          <div style={{ margin: '500px' }}>Yield Sources</div>
        </Card>
      </div>
      <div id="security">
        <Card variant="cardPrimary">
          <div style={{ margin: '500px' }}>Security</div>
        </Card>
      </div>
      <div id="faq">
        <Card variant="cardPrimary">
          <div style={{ margin: '500px' }}>Faq</div>
        </Card>
      </div>
    </>
  )
}

import { Card, TabBar } from '@summerfi/app-earn-ui'

import portfolioLockedSumrInfoV2Styles from './PortfolioLockedSumrInfoV2.module.css'

export const PortfolioLockedSumrInfoV2 = () => {
  return (
    <div className={portfolioLockedSumrInfoV2Styles.wrapper}>
      <Card variant="cardSecondary">
        <TabBar
          tabs={[
            {
              id: 'your-locked-sumr-positions',
              label: 'Your Locked SUMR Positions',
              content: <>Your Locked SUMR Positions content</>,
            },
            {
              id: 'all-locked-sumr-positions',
              label: 'All Locked SUMR Positions',
              content: <>All Locked SUMR Positions content</>,
            },
          ]}
        />
      </Card>
    </div>
  )
}

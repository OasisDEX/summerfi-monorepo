'use client'

import { StrategyGridPreview, Text } from '@summerfi/app-earn-ui'

import { strategiesList } from '@/constants/dev-strategies-list'

type EarnStrategyOpenPageProps = {
  params: {
    position_id: string
  }
}

const EarnStrategyOpenPage = ({ params: _params }: EarnStrategyOpenPageProps) => {
  return (
    <StrategyGridPreview
      strategy={strategiesList[0]}
      strategies={strategiesList}
      leftContent={
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-space-x-large)',
            width: '100%',
          }}
        >
          this page needs to be done (manage strategy)
        </div>
      }
      rightContent={<Text>manage sidebar</Text>}
    />
  )
}

export default EarnStrategyOpenPage

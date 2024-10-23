'use client'

import { useMemo } from 'react'
import { StrategyGridPreview, Text } from '@summerfi/app-earn-ui'

import { strategiesList } from '@/constants/dev-strategies-list'

type EarnStrategyOpenPageProps = {
  params: {
    strategy_id: string
  }
}

const EarnStrategyOpenPage = ({ params }: EarnStrategyOpenPageProps) => {
  const selectedStrategyData = useMemo(() => {
    return strategiesList.find((strategy) => strategy.id === params.strategy_id)
  }, [params])

  return (
    <StrategyGridPreview
      strategy={selectedStrategyData as (typeof strategiesList)[number]}
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
          this page needs to be done (manage ${params.strategy_id})
        </div>
      }
      rightContent={<Text>open sidebar</Text>}
    />
  )
}

export default EarnStrategyOpenPage

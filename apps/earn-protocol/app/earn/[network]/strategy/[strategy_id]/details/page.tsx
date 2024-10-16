import { useMemo } from 'react'
import { StrategyGridDetails } from '@summerfi/app-earn-ui'
import { type NetworkNames } from '@summerfi/app-types'

import { StrategyDetailsView } from '@/components/layout/StrategyDetailsView/StrategyDetailsView'
import { strategiesList } from '@/constants/dev-strategies-list'

type StrategyDetailsPageProps = {
  params: {
    network: NetworkNames | 'all-networks'
    strategy_id: string
  }
}

const StrategyDetailsPage = ({ params }: StrategyDetailsPageProps) => {
  const selectedStrategyData = useMemo(() => {
    return strategiesList.find((strategy) => strategy.id === params.strategy_id)
  }, [params])

  return (
    <StrategyGridDetails strategy={selectedStrategyData as (typeof strategiesList)[number]}>
      <StrategyDetailsView />
    </StrategyGridDetails>
  )
}

export default StrategyDetailsPage

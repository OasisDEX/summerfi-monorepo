import { useMemo } from 'react'
import { Card, StrategyGridDetails } from '@summerfi/app-earn-ui'
import { type NetworkNames } from '@summerfi/app-types'

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
      <Card variant="cardPrimary">How it all works</Card>
      <Card variant="cardPrimary">Advanced yield</Card>
      <Card variant="cardPrimary">Security</Card>
      <Card variant="cardPrimary">Faq</Card>
    </StrategyGridDetails>
  )
}

export default StrategyDetailsPage

import { type NetworkNames } from '@summerfi/app-types'

import { StrategiesListView } from '@/components/layout/StrategiesListView/StrategiesListView'

const EarnNetworkSelectedStrategyPage = ({
  params,
}: {
  params: {
    network: NetworkNames
    strategy_id: string
  }
}) => {
  // particular strategy loaded
  return (
    <StrategiesListView selectedNetwork={params.network} selectedStrategy={params.strategy_id} />
  )
}

export default EarnNetworkSelectedStrategyPage

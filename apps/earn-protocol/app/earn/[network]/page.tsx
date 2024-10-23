import { type NetworkNames } from '@summerfi/app-types'

import { StrategiesListView } from '@/components/layout/StrategiesListView/StrategiesListView'

type EarnNetworkStrategiesPageProps = {
  params: {
    network: NetworkNames
  }
}

const EarnNetworkStrategiesPage = ({ params }: EarnNetworkStrategiesPageProps) => {
  // list of strategies (for a network)
  return <StrategiesListView selectedNetwork={params.network} />
}

export default EarnNetworkStrategiesPage

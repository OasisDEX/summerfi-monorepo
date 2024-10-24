import { type SDKNetwork } from '@summerfi/app-types'

import { getVaultsList } from '@/app/server-handlers/sdk/getVaultsList'
import { StrategiesListView } from '@/components/layout/StrategiesListView/StrategiesListView'

export const dynamic = 'force-dynamic'

type EarnNetworkStrategiesPageProps = {
  params: {
    network: SDKNetwork | 'all-networks'
  }
}

const EarnNetworkStrategiesPage = async ({ params }: EarnNetworkStrategiesPageProps) => {
  const strategiesList = await getVaultsList()

  return <StrategiesListView strategiesList={strategiesList} selectedNetwork={params.network} />
}

export default EarnNetworkStrategiesPage

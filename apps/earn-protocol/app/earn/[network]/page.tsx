import { type SDKNetwork } from '@summerfi/app-types'

import { getVaultsList } from '@/app/server-handlers/sdk/getVaultsList'
import { StrategiesListView } from '@/components/layout/StrategiesListView/StrategiesListView'

type EarnNetworkStrategiesPageProps = {
  params: {
    network: SDKNetwork | 'all-networks'
  }
}

export const revalidate = 60

const EarnNetworkStrategiesPage = async ({ params }: EarnNetworkStrategiesPageProps) => {
  const strategiesList = await getVaultsList()

  return <StrategiesListView strategiesList={strategiesList} selectedNetwork={params.network} />
}

export default EarnNetworkStrategiesPage

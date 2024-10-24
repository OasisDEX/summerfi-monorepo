import { StrategiesListView } from '@/components/layout/StrategiesListView/StrategiesListView'
import { getVaultsList } from '@/server-handlers/sdk/getVaultsList'

const EarnAllStrategiesPage = async () => {
  const strategiesList = await getVaultsList()

  return <StrategiesListView strategiesList={strategiesList} />
}

export default EarnAllStrategiesPage

import { StrategiesListView } from '@/components/layout/StrategiesListView/StrategiesListView'
import { getVaultsList } from '@/server-handlers/sdk/getVaultsList'

const EarnAllStrategiesPage = async () => {
  const strategiesList = await getVaultsList()

  console.log('strategiesList[0].protocol', strategiesList[0].protocol)

  return <StrategiesListView strategiesList={strategiesList} />
}

export default EarnAllStrategiesPage

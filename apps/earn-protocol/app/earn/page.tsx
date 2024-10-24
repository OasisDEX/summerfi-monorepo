import { getVaultsList } from '@/app/server-handlers/sdk/getVaultsList'
import { StrategiesListView } from '@/components/layout/StrategiesListView/StrategiesListView'

export const revalidate = 60

const EarnAllStrategiesPage = async () => {
  const strategiesList = await getVaultsList()

  return <StrategiesListView strategiesList={strategiesList} />
}

export default EarnAllStrategiesPage

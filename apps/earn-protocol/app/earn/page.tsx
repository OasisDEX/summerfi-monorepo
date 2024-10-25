import { getVaultsList } from '@/app/server-handlers/sdk/getVaultsList'
import { StrategiesListView } from '@/components/layout/StrategiesListView/StrategiesListView'

export const revalidate = 60

const EarnAllStrategiesPage = async () => {
  const { vaults } = await getVaultsList()

  return <StrategiesListView strategiesList={vaults} />
}

export default EarnAllStrategiesPage

import { getVaultsList } from '@/app/server-handlers/sdk/getVaultsList'
import { VaultsListView } from '@/components/layout/VaultsListView/VaultsListView'

export const revalidate = 60

const EarnAllVaultsPage = async () => {
  const { vaults } = await getVaultsList()

  return <VaultsListView vaultsList={vaults} />
}

export default EarnAllVaultsPage

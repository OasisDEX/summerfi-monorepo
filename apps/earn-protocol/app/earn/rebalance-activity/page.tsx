import { getRebalances } from '@/app/server-handlers/sdk/getRebalances'
import { getVaultsList } from '@/app/server-handlers/sdk/getVaultsList'
import { RebalanceActivityView } from '@/features/rebalance-activity/components/RebalanceActivityView/RebalanceActivityView'

export const revalidate = 60

const RebalanceActivityPage = async () => {
  const [{ vaults }, { rebalances }] = await Promise.all([
    await getVaultsList(),
    await getRebalances(),
  ])

  return <RebalanceActivityView vaultsList={vaults} rebalancesList={rebalances} />
}

export default RebalanceActivityPage

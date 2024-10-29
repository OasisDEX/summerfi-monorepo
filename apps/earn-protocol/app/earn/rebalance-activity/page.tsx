import { getVaultsList } from '@/app/server-handlers/sdk/getVaultsList'
import { RebalanceActivityView } from '@/features/rebalance-activity/components/RebalanceActivityView/RebalanceActivityView'
import { rebalancingActivityRawData } from '@/features/rebalance-activity/table/dummyData'

export const revalidate = 60

const RebalanceActivityPage = async () => {
  const { vaults } = await getVaultsList()

  return <RebalanceActivityView rawData={rebalancingActivityRawData} vaultsList={vaults} />
}

export default RebalanceActivityPage

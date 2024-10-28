import { RebalanceActivityView } from '@/features/rebalance-activity/components/RebalanceActivityView/RebalanceActivityView'
import { rebalancingActivityRawData } from '@/features/rebalance-activity/table/dummyData'

const RebalanceActivityPage = () => {
  return <RebalanceActivityView rawData={rebalancingActivityRawData} />
}

export default RebalanceActivityPage

import { TriggersQuery } from '@summerfi/automation-subgraph'
import { PublicClient } from 'viem'

export const getMakerPositionInfo = async (
  publicClient: PublicClient,
  trigger: TriggersQuery['triggers'][number],
) => {
  // TODO: get at least ltv/coll ratio
  console.log('getMakerPositionInfo', trigger)
  return {}
}

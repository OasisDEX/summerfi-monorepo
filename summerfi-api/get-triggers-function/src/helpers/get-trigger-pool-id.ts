import type { TriggersQuery } from '@summerfi/automation-subgraph'

export const getTriggerPoolId = (trigger: TriggersQuery['triggers'][number]) =>
  trigger.decodedData[trigger.decodedDataNames.indexOf('poolId')]

import { TriggersQuery } from '@summerfi/automation-subgraph'

export const filterTrigger =
  (triggerType: bigint) => (trigger: TriggersQuery['triggers'][number]) =>
    BigInt(trigger.triggerType) === triggerType

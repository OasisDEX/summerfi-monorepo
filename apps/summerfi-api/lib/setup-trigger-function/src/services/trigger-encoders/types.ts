export type TriggerTransactions = {
  encodedTriggerData: `0x${string}`
  upsertTrigger: `0x${string}`
  removeTrigger?: `0x${string}`
}

export type CurrentTriggerLike = {
  id: bigint
  triggerData: `0x${string}`
}

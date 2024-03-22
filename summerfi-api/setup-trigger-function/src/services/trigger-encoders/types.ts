import { AddableTrigger, RemovableTrigger } from './automation-bot-helper'

export type TriggerTransactions = {
  encodedTriggerData: `0x${string}`
  upsertTrigger: `0x${string}`
  removeTrigger?: `0x${string}`
}

export type EncodedTriggers = {
  addableTrigger: AddableTrigger
  removableTrigger?: RemovableTrigger
}

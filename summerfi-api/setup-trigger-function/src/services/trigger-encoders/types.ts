import { LTV, Price } from '~types'
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

export type CurrentTriggerLike = {
  id: bigint
  triggerData: `0x${string}`
  triggersOnAccount: number
}

export interface CurrentStopLoss extends CurrentTriggerLike {
  executionPrice: Price
  executionLTV: LTV
}

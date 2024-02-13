import { PositionLike, TriggerData, Price } from '~types'

export const AAVE_TRANSACTION_PRICE_DECIMALS = 8n

export type EncodedFunction = {
  encodedTriggerData: `0x${string}`
  txData: `0x${string}`
}

export type TriggerTransactions = {
  encodedTriggerData: `0x${string}`
  upsertTrigger: `0x${string}`
  removeTrigger?: `0x${string}`
}

export type CurrentTriggerLike = {
  id: bigint
  triggerData: `0x${string}`
}

export type EncoderFunction<TTriggerData extends TriggerData> = (
  position: PositionLike,
  triggerData: TTriggerData,
  debtPriceInUSD: Price,
  currentTrigger: CurrentTriggerLike | undefined,
) => TriggerTransactions

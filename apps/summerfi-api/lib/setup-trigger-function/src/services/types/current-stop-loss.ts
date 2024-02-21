import { LTV, Price } from '~types'

export interface CurrentStopLoss {
  id: bigint
  triggerData: `0x${string}`
  executionPrice: Price
  executionLTV: LTV
}

import { SumrBalancesData } from '@/app/server-handlers/sumr-balances'

export interface SimulatedTransactionDetails {
  gasOnDestination: string
  amountReceived: string
  fee: string
  isReady: boolean
}

export interface SendParam {
  dstEid: number
  to: `0x${string}`
  amountLD: bigint
  minAmountLD: bigint
  extraOptions: `0x${string}`
  composeMsg: `0x${string}`
  oftCmd: `0x${string}`
}

export interface Fee {
  nativeFee: bigint
  lzTokenFee: bigint
}

export type BridgeExternalData = {
  sumrBalances: SumrBalancesData
}

export enum BridgeTxStatuses {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

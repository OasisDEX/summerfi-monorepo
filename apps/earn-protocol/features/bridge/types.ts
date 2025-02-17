import type { Chain } from 'viem/chains'

import type { SumrBalancesData } from '@/app/server-handlers/sumr-balances'

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
  NOT_STARTED = 'not-started',
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export type BridgeState = {
  sumrBalances: Omit<BridgeExternalData['sumrBalances'], 'raw'>
  bridgeStatus: BridgeTxStatuses | undefined
  recipient: string | undefined
  walletAddress: string
  destinationChain: Chain
}

export type BridgeReducerAction =
  | {
      type: 'update-bridge-status'
      payload: BridgeTxStatuses | undefined
    }
  | {
      type: 'update-recipient'
      payload: string | undefined
    }
  | {
      type: 'update-wallet-address'
      payload: string
    }
  | {
      type: 'update-destination-chain'
      payload: Chain
    }

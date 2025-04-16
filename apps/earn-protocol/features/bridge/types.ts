import type { Chain } from 'viem/chains'

import type { SumrBalancesData } from '@/app/server-handlers/sumr-balances'

export type BridgeExternalData = {
  sumrBalances: SumrBalancesData
}

export enum BridgeTxStatus {
  NOT_STARTED = 'not-started',
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export type BridgeState = {
  amount: string | undefined
  sumrBalances: Omit<BridgeExternalData['sumrBalances'], 'raw'>
  bridgeStatus: BridgeTxStatus
  recipient: string | undefined
  walletAddress: string
  destinationChain: Chain
  transactionHash: string | undefined
  error: string | undefined
}

export type BridgeReducerAction =
  | {
      type: 'bridge-transaction-created'
      payload: {
        hash: string
        amount: string
      }
    }
  | {
      type: 'update-bridge-status'
      payload: BridgeTxStatus
    }
  | {
      type: 'error'
      payload: string
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
  | {
      type: 'update-transaction-hash'
      payload: string
    }
  | {
      type: 'reset'
    }

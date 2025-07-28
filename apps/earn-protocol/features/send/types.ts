import { type SupportedNetworkIds, type TokenSymbolsList } from '@summerfi/app-types'

export enum SendStep {
  INIT = 'init',
  PENDING = 'pending',
  COMPLETED = 'completed',
}

export enum SendTxStatuses {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export type SendTokenDropdown = {
  label: string
  value: string
  tokenSymbol: TokenSymbolsList
  chainId: SupportedNetworkIds
}

export type SendState = {
  step: SendStep
  txStatus?: SendTxStatuses
  recipientAddress: string
  tokenDropdown: SendTokenDropdown
  walletAddress: string
}

export type SendReducerAction =
  | {
      type: 'update-step'
      payload: SendStep
    }
  | {
      type: 'update-tx-status'
      payload: SendTxStatuses | undefined
    }
  | {
      type: 'update-recipient-address'
      payload: string
    }
  | {
      type: 'update-token-dropdown'
      payload: SendTokenDropdown
    }
  | {
      type: 'reset'
      payload?: Partial<SendState>
    }

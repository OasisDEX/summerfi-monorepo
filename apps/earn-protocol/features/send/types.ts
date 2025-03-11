export enum SendStep {
  INIT = 'init',
  COMPLETED = 'completed',
}

export enum SendTxStatuses {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export type SendState = {
  step: SendStep
  txStatus?: SendTxStatuses
  recipientAddress: string
}

export type SendReducerAction =
  | {
      type: 'update-step'
      payload: SendStep
    }
  | {
      type: 'update-tx-status'
      payload: SendTxStatuses
    }
  | {
      type: 'update-recipient-address'
      payload: string
    }
  | {
      type: 'reset'
    }

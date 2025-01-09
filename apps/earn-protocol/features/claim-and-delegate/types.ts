export enum ClaimDelegateSteps {
  TERMS = 'terms',
  CLAIM = 'claim',
  DELEGATE = 'delegate',
}

export enum ClaimDelegateTxStatuses {
  PENDING = 'pending',
  COMPLETED = 'COMPLETED',
  FAILED = 'failed',
}

export type ClaimDelegateState = {
  step: ClaimDelegateSteps
  delegatee: string | undefined
  claimStatus: ClaimDelegateTxStatuses | undefined
  delegateStatus: ClaimDelegateTxStatuses | undefined
  walletAddress: string
}

export type ClaimDelegateReducerAction =
  | {
      type: 'update-step'
      payload: ClaimDelegateSteps
    }
  | {
      type: 'update-delegatee'
      payload: string | undefined
    }
  | {
      type: 'update-claim-status'
      payload: ClaimDelegateTxStatuses
    }
  | {
      type: 'update-delegate-status'
      payload: ClaimDelegateTxStatuses
    }

export type ClaimDelegateExternalData = {
  sumrPrice: string
  sumrEarned: string
  sumrToClaim: string
  sumrApy: string
  sumrDelegated: string
  delegatedTo: string
  votes?: {
    delegate: string
    amountOfVotes: string
  }[]
}

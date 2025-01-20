import { type SumrBalancesData } from '@/app/server-handlers/sumr-balances'
import { type SumrDelegateStakeData } from '@/app/server-handlers/sumr-delegate-stake'
import { type SumrDelegates } from '@/app/server-handlers/sumr-delegates'
import { type SumrStakingInfoData } from '@/app/server-handlers/sumr-staking-info'
import { type SumrToClaimData } from '@/app/server-handlers/sumr-to-claim'

export enum ClaimDelegateSteps {
  TERMS = 'terms',
  CLAIM = 'claim',
  DELEGATE = 'delegate',
}

export enum ClaimDelegateTxStatuses {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export type ClaimDelegateState = {
  step: ClaimDelegateSteps
  delegatee: string | undefined
  claimStatus: ClaimDelegateTxStatuses | undefined
  delegateStatus: ClaimDelegateTxStatuses | undefined
  stakingStatus: ClaimDelegateTxStatuses | undefined
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
  | {
      type: 'update-staking-status'
      payload: ClaimDelegateTxStatuses
    }

export type ClaimDelegateExternalData = {
  sumrToClaim: SumrToClaimData
  sumrStakeDelegate: SumrDelegateStakeData
  sumrBalances: SumrBalancesData
  sumrStakingInfo: SumrStakingInfoData
  sumrDelegates: SumrDelegates[]
}

import { type SumrBalancesData } from '@/app/server-handlers/sumr-balances'
import { type SumrDecayFactorData } from '@/app/server-handlers/sumr-decay-factor'
import { type SumrDelegateStakeData } from '@/app/server-handlers/sumr-delegate-stake'
import { type SumrDelegates } from '@/app/server-handlers/sumr-delegates'
import { type SumrStakingInfoData } from '@/app/server-handlers/sumr-staking-info'
import { type SumrToClaimData } from '@/app/server-handlers/sumr-to-claim'

export enum ClaimDelegateSteps {
  TERMS = 'terms',
  CLAIM = 'claim',
  DELEGATE = 'delegate',
  STAKE = 'stake',
  COMPLETED = 'completed',
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
  stakingApproveStatus: ClaimDelegateTxStatuses | undefined
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
      payload: ClaimDelegateTxStatuses | undefined
    }
  | {
      type: 'update-delegate-status'
      payload: ClaimDelegateTxStatuses | undefined
    }
  | {
      type: 'update-staking-status'
      payload: ClaimDelegateTxStatuses | undefined
    }
  | {
      type: 'update-staking-approve-status'
      payload: ClaimDelegateTxStatuses | undefined
    }

export type ClaimDelegateExternalData = {
  sumrToClaim: SumrToClaimData
  sumrStakeDelegate: SumrDelegateStakeData
  sumrBalances: SumrBalancesData
  sumrStakingInfo: SumrStakingInfoData
  sumrDelegates: SumrDelegates[]
  sumrDecayFactors: SumrDecayFactorData[]
}

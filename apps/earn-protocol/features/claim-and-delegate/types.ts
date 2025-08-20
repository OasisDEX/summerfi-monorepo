import { type SupportedNetworkIds, type UiTransactionStatuses } from '@summerfi/app-types'
import { type HumanReadableNetwork } from '@summerfi/app-utils'

import { type SumrBalancesData } from '@/app/server-handlers/sumr-balances'
import { type SumrDelegateStakeData } from '@/app/server-handlers/sumr-delegate-stake'
import { type SumrStakingInfoData } from '@/app/server-handlers/sumr-staking-info'
import { type SumrToClaimData } from '@/app/server-handlers/sumr-to-claim'
import { type TallyDelegate } from '@/app/server-handlers/tally'

export enum ClaimDelegateSteps {
  TERMS = 'terms',
  CLAIM = 'claim',
  DELEGATE = 'delegate',
  STAKE = 'stake',
  COMPLETED = 'completed',
}

export enum ClaimDelegateStakeType {
  ADD_STAKE = 'add-stake',
  REMOVE_STAKE = 'remove-stake',
}

// Define types for balance tracking
export type ClaimableBalances = {
  [key in SupportedNetworkIds]: number
}
export type WalletBalances = {
  [key in HumanReadableNetwork]: number
}

export type MerklIsAuthorizedPerChain = {
  [key: number]: boolean
}

export type ClaimDelegateState = {
  step: ClaimDelegateSteps
  delegatee: string | undefined
  claimStatus: UiTransactionStatuses | undefined
  merklStatus: UiTransactionStatuses | undefined
  delegateStatus: UiTransactionStatuses | undefined
  stakingStatus: UiTransactionStatuses | undefined
  stakingApproveStatus: UiTransactionStatuses | undefined
  stakeType: ClaimDelegateStakeType
  stakeChangeAmount: string | undefined
  walletAddress: string
  pendingClaimChainId: SupportedNetworkIds | undefined
  // Add balance tracking
  claimableBalances: ClaimableBalances
  walletBalances: WalletBalances
  merklIsAuthorizedPerChain: MerklIsAuthorizedPerChain
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
      type: 'update-merkl-status'
      payload: UiTransactionStatuses | undefined
    }
  | {
      type: 'update-claim-status'
      payload: UiTransactionStatuses | undefined
    }
  | {
      type: 'update-delegate-status'
      payload: UiTransactionStatuses | undefined
    }
  | {
      type: 'update-staking-status'
      payload: UiTransactionStatuses | undefined
    }
  | {
      type: 'update-staking-approve-status'
      payload: UiTransactionStatuses | undefined
    }
  | {
      type: 'update-stake-type'
      payload: ClaimDelegateStakeType
    }
  | {
      type: 'update-stake-change-amount'
      payload: string | undefined
    }
  | {
      type: 'set-pending-claim'
      payload: SupportedNetworkIds | undefined
    }
  | {
      type: 'update-claimable-balances'
      payload: ClaimableBalances
    }
  | {
      type: 'update-wallet-balances'
      payload: WalletBalances
    }
  | {
      type: 'update-merkl-is-authorized-per-chain'
      payload: MerklIsAuthorizedPerChain
    }

export type ClaimDelegateExternalData = {
  sumrToClaim: SumrToClaimData
  sumrStakeDelegate: SumrDelegateStakeData
  sumrBalances: SumrBalancesData
  sumrStakingInfo: SumrStakingInfoData
  tallyDelegates: TallyDelegate[]
}

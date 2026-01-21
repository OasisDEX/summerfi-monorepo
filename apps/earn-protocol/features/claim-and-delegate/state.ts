import {
  type ClaimableBalances,
  type ClaimDelegateReducerAction,
  ClaimDelegateStakeType,
  type ClaimDelegateState,
  ClaimDelegateSteps,
  type MerklIsAuthorizedPerChain,
  type WalletBalances,
} from '@/features/claim-and-delegate/types'

export const claimDelegateState: ClaimDelegateState = {
  step: ClaimDelegateSteps.TERMS,
  delegatee: undefined,
  merklStatus: undefined,
  claimStatus: undefined,
  delegateStatus: undefined,
  stakingStatus: undefined,
  stakingApproveStatus: undefined,
  walletAddress: '0x0', // dummy, invalid address for init
  stakeType: ClaimDelegateStakeType.ADD_STAKE,
  stakeChangeAmount: undefined,
  pendingClaimChainId: undefined,
  claimableBalances: {} as ClaimableBalances,
  walletBalances: {} as WalletBalances,
  merklIsAuthorizedPerChain: {} as MerklIsAuthorizedPerChain,
  authorizedStakingRewardsCallerBase: undefined,
}

export const claimDelegateReducer = (
  prevState: ClaimDelegateState,
  action: ClaimDelegateReducerAction,
): ClaimDelegateState => {
  switch (action.type) {
    case 'update-step':
      return {
        ...prevState,
        step: action.payload,
      }
    case 'update-delegatee':
      return {
        ...prevState,
        delegatee: action.payload,
      }
    case 'update-claim-status':
      return {
        ...prevState,
        claimStatus: action.payload,
      }
    case 'update-merkl-status':
      return {
        ...prevState,
        merklStatus: action.payload,
      }
    case 'update-delegate-status':
      return {
        ...prevState,
        delegateStatus: action.payload,
      }
    case 'update-staking-approve-status':
      return {
        ...prevState,
        stakingApproveStatus: action.payload,
      }
    case 'update-staking-status':
      return {
        ...prevState,
        stakingStatus: action.payload,
      }
    case 'update-stake-type':
      return {
        ...prevState,
        stakeType: action.payload,
      }
    case 'update-stake-change-amount':
      return {
        ...prevState,
        stakeChangeAmount: action.payload,
      }
    case 'set-pending-claim':
      return {
        ...prevState,
        claimStatus: undefined,
        pendingClaimChainId: action.payload ?? undefined,
      }
    case 'update-claimable-balances':
      return {
        ...prevState,
        claimableBalances: action.payload,
      }
    case 'update-wallet-balances':
      return {
        ...prevState,
        walletBalances: action.payload,
      }
    case 'update-merkl-is-authorized-per-chain':
      return {
        ...prevState,
        merklIsAuthorizedPerChain: action.payload,
      }
    case 'update-staking-rewards-caller-status':
      return {
        ...prevState,
        authorizedStakingRewardsCallerBase: action.payload,
      }
    default:
      return prevState
  }
}

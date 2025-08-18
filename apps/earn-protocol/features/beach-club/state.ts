import { type MerklIsAuthorizedPerChain } from '@/features/claim-and-delegate/types'

import { type BeachClubReducerAction, type BeachClubState } from './types'

export const beachClubDefaultState: BeachClubState = {
  merklStatus: undefined,
  claimStatus: undefined,
  walletAddress: '0x0', // dummy, invalid address for init
  merklIsAuthorizedPerChain: {} as MerklIsAuthorizedPerChain,
  feesClaimed: false,
}

export const beachClubReducer = (
  prevState: BeachClubState,
  action: BeachClubReducerAction,
): BeachClubState => {
  switch (action.type) {
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
    case 'update-merkl-is-authorized-per-chain':
      return {
        ...prevState,
        merklIsAuthorizedPerChain: action.payload,
      }
    case 'update-fees-claimed':
      return {
        ...prevState,
        feesClaimed: action.payload,
      }
    default:
      return prevState
  }
}

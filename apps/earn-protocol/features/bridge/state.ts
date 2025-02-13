import {
  type BridgeReducerAction,
  BridgeStakeType,
  type BridgeState,
  BridgeSteps,
} from '@/features/bridge/types'

export const bridgeState: BridgeState = {
  step: BridgeSteps.TERMS,
  amount: 0,
  walletAddress: '0x0', // dummy, invalid address for init
}

export const bridgeReducer = (prevState: BridgeState, action: BridgeReducerAction) => {
  switch (action.type) {
    case 'update-amount':
      return {
        ...prevState,
        amount: action.payload,
      }
    // case 'update-delegatee':
    //   return {
    //     ...prevState,
    //     delegatee: action.payload,
    //   }
    // case 'update-claim-status':
    //   return {
    //     ...prevState,
    //     claimStatus: action.payload,
    //   }
    // case 'update-delegate-status':
    //   return {
    //     ...prevState,
    //     delegateStatus: action.payload,
    //   }
    // case 'update-staking-approve-status':
    //   return {
    //     ...prevState,
    //     stakingApproveStatus: action.payload,
    //   }
    // case 'update-staking-status':
    //   return {
    //     ...prevState,
    //     stakingStatus: action.payload,
    //   }
    // case 'update-stake-type':
    //   return {
    //     ...prevState,
    //     stakeType: action.payload,
    //   }
    // case 'update-stake-change-amount':
    //   return {
    //     ...prevState,
    //     stakeChangeAmount: action.payload,
    //   }
    default:
      return prevState
  }
}

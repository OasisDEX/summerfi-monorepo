import { base } from 'viem/chains'

import {
  type BridgeReducerAction,
  type BridgeState,
  BridgeTxStatuses,
} from '@/features/bridge/types'

export const bridgeState: BridgeState = {
  bridgeStatus: BridgeTxStatuses.NOT_STARTED,
  amount: 0,
  recipient: undefined,
  walletAddress: '0x0', // dummy, invalid address for initial state
  destinationChain: base,
  sumrBalances: {
    mainnet: '0',
    arbitrum: '0',
    base: '0',
    total: '0',
    vested: '0',
  },
}

export const bridgeReducer = (prevState: BridgeState, action: BridgeReducerAction) => {
  switch (action.type) {
    case 'update-amount':
      return {
        ...prevState,
        amount: action.payload,
      }
    case 'update-bridge-status':
      return {
        ...prevState,
        bridgeStatus: action.payload,
      }
    case 'update-recipient':
      return {
        ...prevState,
        recipient: action.payload,
      }
    case 'update-wallet-address':
      return {
        ...prevState,
        walletAddress: action.payload,
      }
    case 'update-destination-chain':
      return {
        ...prevState,
        destinationChain: action.payload,
      }
    default:
      return prevState
  }
}

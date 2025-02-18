import { base } from 'viem/chains'

import { type BridgeReducerAction, type BridgeState, BridgeTxStatus } from '@/features/bridge/types'

export const bridgeState: BridgeState = {
  bridgeStatus: BridgeTxStatus.NOT_STARTED,
  recipient: undefined,
  walletAddress: '0x0',
  destinationChain: base,
  transactionHash: undefined,
  amount: '0',
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
    case 'bridge-transaction-created':
      return {
        ...prevState,
        bridgeStatus: BridgeTxStatus.PENDING,
        transactionHash: action.payload.hash,
        amount: action.payload.amount,
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
    case 'update-transaction-hash':
      return {
        ...prevState,
        transactionHash: action.payload,
      }
    case 'reset':
      return {
        ...bridgeState,
        bridgeStatus: BridgeTxStatus.NOT_STARTED,
        walletAddress: prevState.walletAddress,
        sumrBalances: prevState.sumrBalances,
      }
    default:
      return prevState
  }
}

import { base } from 'viem/chains'

import { type BridgeReducerAction, type BridgeState, BridgeTxStatus } from '@/features/bridge/types'

export const bridgeState: BridgeState = {
  bridgeStatus: BridgeTxStatus.NOT_STARTED,
  recipient: undefined,
  walletAddress: '0x0',
  destinationChain: base,
  transactionHash: undefined,
  amount: '0',
  error: undefined,
  sumrBalances: {
    mainnet: '0',
    arbitrum: '0',
    base: '0',
    total: '0',
    vested: '0',
    sonic: '0',
    hyperliquid: '0',
    optimism: '0',
  },
}

export const bridgeReducer = (prevState: BridgeState, action: BridgeReducerAction) => {
  const validateTransition = (from: BridgeTxStatus, to: BridgeTxStatus) => {
    const validTransitions = {
      [BridgeTxStatus.NOT_STARTED]: [BridgeTxStatus.PENDING],
      [BridgeTxStatus.PENDING]: [
        BridgeTxStatus.NOT_STARTED,
        BridgeTxStatus.COMPLETED,
        BridgeTxStatus.FAILED,
      ],
      [BridgeTxStatus.COMPLETED]: [BridgeTxStatus.NOT_STARTED],
      [BridgeTxStatus.FAILED]: [BridgeTxStatus.NOT_STARTED],
    }

    if (!validTransitions[from].includes(to)) {
      throw new Error(`Invalid transition from ${from} to ${to}`)
    }
  }

  try {
    switch (action.type) {
      case 'bridge-transaction-created':
        validateTransition(prevState.bridgeStatus, BridgeTxStatus.PENDING)

        if (isNaN(Number(action.payload.amount)) || Number(action.payload.amount) <= 0) {
          return {
            ...prevState,
            bridgeStatus: BridgeTxStatus.FAILED,
            error: 'Invalid amount',
          }
        }

        return {
          ...prevState,
          bridgeStatus: BridgeTxStatus.PENDING,
          transactionHash: action.payload.hash,
          amount: action.payload.amount,
        }
      case 'error':
        return {
          ...prevState,
          bridgeStatus: BridgeTxStatus.FAILED,
          error: action.payload,
        }
      case 'update-bridge-status':
        validateTransition(prevState.bridgeStatus, action.payload)

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
        validateTransition(prevState.bridgeStatus, BridgeTxStatus.NOT_STARTED)

        return {
          ...bridgeState,
          bridgeStatus: BridgeTxStatus.NOT_STARTED,
          walletAddress: prevState.walletAddress,
          sumrBalances: prevState.sumrBalances,
        }
      default:
        return prevState
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Bridge reducer error', error)

    return {
      ...prevState,
      bridgeStatus: BridgeTxStatus.FAILED,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

import type { ITokenAmount } from '@summerfi/sdk-common'

import { useAppSDK } from './use-app-sdk'

export const useDepositTX = () => {
  const { getDepositTX, getChainInfo, getWalletAddress } = useAppSDK()

  return ({
    fleetAddress,
    amount,
    slippage,
    shouldStake,
  }: {
    fleetAddress: string
    amount: ITokenAmount
    slippage: number
    shouldStake?: boolean
  }) => {
    return getDepositTX({
      chainInfo: getChainInfo(),
      walletAddress: getWalletAddress(),
      fleetAddress,
      amount,
      slippage,
      shouldStake,
    })
  }
}

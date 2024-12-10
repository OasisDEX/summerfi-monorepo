import type { ITokenAmount } from '@summerfi/sdk-common'

import { useAppSDK } from './use-app-sdk'

export const useWithdrawTX = () => {
  const { getWithdrawTX, getChainInfo, getWalletAddress } = useAppSDK()

  return ({
    fleetAddress,
    amount,
    slippage,
  }: {
    fleetAddress: string
    amount: ITokenAmount
    slippage: number
  }) => {
    return getWithdrawTX({
      chainInfo: getChainInfo(),
      walletAddress: getWalletAddress(),
      fleetAddress,
      amount,
      slippage,
    })
  }
}

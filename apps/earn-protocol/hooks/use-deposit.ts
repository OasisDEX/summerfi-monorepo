import { useAppSDK } from './use-app-sdk'

export const useDepositTX = () => {
  const { getDepositTX, getChainInfo, getWalletAddress } = useAppSDK()

  return ({
    fleetAddress,
    amountString,
    slippage,
    shouldStake,
  }: {
    fleetAddress: string
    amountString: string
    slippage: number
    shouldStake?: boolean
  }) => {
    return getDepositTX({
      chainInfo: getChainInfo(),
      walletAddress: getWalletAddress(),
      fleetAddress,
      amount: amountString,
      slippage,
      shouldStake,
    })
  }
}

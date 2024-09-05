import { useAppSDK } from './use-app-sdk'

export const useWithdrawTX = () => {
  const { getWithdrawTX } = useAppSDK()

  return ({
    chainId,
    walletAddress,
    fleetAddress,
    amountString,
  }: {
    chainId: number
    walletAddress: string
    fleetAddress: string
    amountString: string
  }) => {
    return getWithdrawTX({
      chainId,
      fleetAddress,
      walletAddress,
      amount: amountString,
    })
  }
}

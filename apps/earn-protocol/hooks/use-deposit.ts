import { useAppSDK } from './use-app-sdk'

export const useDepositTX = () => {
  const { getDepositTX } = useAppSDK()

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
    return getDepositTX({
      chainId,
      fleetAddress,
      walletAddress,
      amount: amountString,
    })
  }
}

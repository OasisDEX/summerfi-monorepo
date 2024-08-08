import { useSDK } from '@/hooks/use-sdk'

export const useWithdraw = () => {
  const { getWithdrawTX } = useSDK()

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

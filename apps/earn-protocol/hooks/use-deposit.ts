import { useSDK } from '@/hooks/use-sdk'

export const useDeposit = () => {
  const { getNewDepositTX } = useSDK()

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
    return getNewDepositTX({
      chainId,
      fleetAddress,
      walletAddress,
      amount: amountString,
    })
  }
}

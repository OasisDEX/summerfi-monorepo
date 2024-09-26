import { useAppSDK } from './use-app-sdk'

export const useDepositTX = () => {
  const { getDepositTX, getChainInfo, getWalletAddress } = useAppSDK()

  return ({ fleetAddress, amountString }: { fleetAddress: string; amountString: string }) => {
    return getDepositTX({
      chainInfo: getChainInfo(),
      walletAddress: getWalletAddress(),
      fleetAddress,
      amount: amountString,
    })
  }
}

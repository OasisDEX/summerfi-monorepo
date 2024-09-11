import { useAppSDK } from './use-app-sdk'

export const useDepositTX = () => {
  const { getDepositTX, getChainInfo, getWalletAddress, getFleetAddress } = useAppSDK()

  return ({ fleetAddress, amountString }: { fleetAddress: string; amountString: string }) => {
    return getDepositTX({
      chainInfo: getChainInfo(),
      walletAddress: getWalletAddress(),
      fleetAddress: getFleetAddress(fleetAddress),
      amount: amountString,
    })
  }
}

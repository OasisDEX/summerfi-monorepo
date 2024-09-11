import { useAppSDK } from './use-app-sdk'

export const useWithdrawTX = () => {
  const { getWithdrawTX, getChainInfo, getWalletAddress, getFleetAddress } = useAppSDK()

  return ({ fleetAddress, amountString }: { fleetAddress: string; amountString: string }) => {
    return getWithdrawTX({
      chainInfo: getChainInfo(),
      walletAddress: getWalletAddress(),
      fleetAddress: getFleetAddress(fleetAddress),
      amount: amountString,
    })
  }
}

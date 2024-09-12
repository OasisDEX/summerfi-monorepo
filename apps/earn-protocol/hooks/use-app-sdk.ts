import { useSDK } from '@summerfi/sdk-client-react'
import { useConnectWallet } from '@web3-onboard/react'

export const useAppSDK = () => {
  const [{ wallet }] = useConnectWallet()

  const chainId = wallet?.chains[0].id ? Number(wallet.chains[0].id) : undefined
  const walletAddress = wallet?.accounts[0].address

  return useSDK({ chainId, walletAddress })
}

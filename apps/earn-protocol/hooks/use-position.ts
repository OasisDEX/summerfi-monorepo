import { useEffect, useState } from 'react'
import { type SDKSupportedChain } from '@summerfi/app-types'
import { type IArmadaPosition } from '@summerfi/sdk-client'
import { Address, getChainInfoByChainId, User, Wallet } from '@summerfi/sdk-client-react'

import { useAppSDK } from '@/hooks/use-app-sdk'
import { useUserWallet } from '@/hooks/use-user-wallet'

export const usePosition = ({
  vaultId,
  chainId,
}: {
  vaultId: string
  chainId: SDKSupportedChain
}) => {
  const [position, setPosition] = useState<IArmadaPosition>()
  const { getUserPosition } = useAppSDK()
  const { userWalletAddress } = useUserWallet()

  useEffect(() => {
    if (!userWalletAddress) return

    const wallet = Wallet.createFrom({
      address: Address.createFromEthereum({
        value: userWalletAddress.toLowerCase(),
      }),
    })
    const chainInfo = getChainInfoByChainId(chainId)
    const sdkUser = User.createFrom({
      chainInfo,
      wallet,
    })

    getUserPosition({
      fleetAddress: vaultId,
      user: sdkUser,
    }).then(setPosition)
  }, [chainId, getUserPosition, userWalletAddress, vaultId])

  return position
}

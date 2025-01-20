import { useEffect, useState } from 'react'
import { type SDKSupportedChain } from '@summerfi/app-types'
import { type IArmadaPosition } from '@summerfi/sdk-client'
import { Address, getChainInfoByChainId, User, Wallet } from '@summerfi/sdk-common'

import { useAppSDK } from '@/hooks/use-app-sdk'
import { useUserWallet } from '@/hooks/use-user-wallet'

export const usePosition = ({
  vaultId,
  chainId,
  onlyActive,
}: {
  vaultId: string
  chainId: SDKSupportedChain
  onlyActive?: boolean
}) => {
  const [position, setPosition] = useState<IArmadaPosition>()
  const { getUserPosition } = useAppSDK()
  const { userWalletAddress } = useUserWallet()

  useEffect(() => {
    if (!userWalletAddress) {
      return
    }
    setPosition(undefined)

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
    }).then((pos) => {
      if (onlyActive && Number(pos.amount.amount) < 0.01) {
        setPosition(undefined)

        return
      }

      setPosition(pos)
    })
  }, [chainId, getUserPosition, userWalletAddress, vaultId, onlyActive])

  return position
}

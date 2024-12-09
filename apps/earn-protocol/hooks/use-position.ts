import { useEffect, useState } from 'react'
import { useUser } from '@account-kit/react'
import { type SDKSupportedChain } from '@summerfi/app-types'
import { type IArmadaPosition } from '@summerfi/sdk-client'
import { Address, getChainInfoByChainId, User, Wallet } from '@summerfi/sdk-client-react'

import { useAppSDK } from '@/hooks/use-app-sdk'

export const usePosition = ({
  vaultId,
  chainId,
}: {
  vaultId: string
  chainId: SDKSupportedChain
}) => {
  const [position, setPosition] = useState<IArmadaPosition>()
  const { getUserPosition } = useAppSDK()
  const user = useUser()

  useEffect(() => {
    if (!user) return

    const wallet = Wallet.createFrom({
      address: Address.createFromEthereum({
        value: user.address.toLowerCase(),
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
  }, [chainId, getUserPosition, user, vaultId])

  return position
}

import { type SDKNetwork } from '@summerfi/app-types'
import { type IArmadaPosition } from '@summerfi/sdk-client-react'
import { Address, getChainInfoByChainId, User, Wallet } from '@summerfi/sdk-common'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'
import { subgraphNetworkToId } from '@/helpers/network-helpers'

export async function getUserPosition({
  network,
  vaultAddress,
  walletAddress,
}: {
  network: SDKNetwork
  vaultAddress: string
  walletAddress: string
}) {
  try {
    const chainId = subgraphNetworkToId(network)
    const chainInfo = getChainInfoByChainId(chainId)

    const fleetAddress = Address.createFromEthereum({
      value: vaultAddress,
    })

    const wallet = Wallet.createFrom({
      address: Address.createFromEthereum({
        value: walletAddress.toLowerCase(),
      }),
    })
    const user = User.createFrom({
      chainInfo,
      wallet,
    })
    const position = await backendSDK.armada.users.getUserPosition({
      fleetAddress,
      user,
    })

    return position as IArmadaPosition | undefined
  } catch (error) {
    throw new Error(`Failed to get users position: ${error}`)
  }
}

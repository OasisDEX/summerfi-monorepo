import { type IArmadaPosition, type SDKNetwork } from '@summerfi/app-types'
import { subgraphNetworkToId } from '@summerfi/app-utils'
import { Address, getChainInfoByChainId, User, Wallet } from '@summerfi/sdk-common'

import { serverOnlyErrorHandler } from '@/app/server-handlers/error-handler'
import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'

export async function getUserPosition({
  network,
  vaultAddress,
  walletAddress,
}: {
  network: SDKNetwork
  vaultAddress?: string
  walletAddress: string
}) {
  try {
    if (!vaultAddress) {
      return undefined
    }

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
    return serverOnlyErrorHandler('getUserPosition', error as string)
  }
}

import { sdkSupportedNetworks } from '@summerfi/app-types'
import { type IArmadaPosition } from '@summerfi/sdk-client-react'
import { Address, getChainInfoByChainId, User, Wallet } from '@summerfi/sdk-common'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'

export async function getUserPositions({ walletAddress }: { walletAddress: string }) {
  try {
    const userPositionsAllNetworksCalls = await Promise.all(
      sdkSupportedNetworks.map(async (chainId) => {
        const chainInfo = getChainInfoByChainId(chainId)

        const wallet = Wallet.createFrom({
          address: Address.createFromEthereum({
            value: walletAddress.toLowerCase(),
          }),
        })
        const user = User.createFrom({
          chainInfo,
          wallet,
        })

        return await backendSDK.armada.users.getUserPositions({
          user,
        })
      }),
    )

    const positionsList = userPositionsAllNetworksCalls
      .filter(Boolean)
      .reduce((acc, position) => [...acc, ...position], [])

    console.log('positionsList', JSON.stringify(positionsList, null, 2))

    return positionsList as IArmadaPosition[] | undefined
  } catch (error) {
    throw new Error(`Failed to get users positions: ${error}`)
  }
}

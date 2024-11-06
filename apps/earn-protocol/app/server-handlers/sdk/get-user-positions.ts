import { type IArmadaPosition } from '@summerfi/sdk-client-react'
import { Address, getChainInfoByChainId, User, Wallet } from '@summerfi/sdk-common'
import { ChainId } from '@summerfi/serverless-shared'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'

export async function getUserPositions({ walletAddress }: { walletAddress: string }) {
  try {
    const chainInfo = getChainInfoByChainId(ChainId.BASE)

    const wallet = Wallet.createFrom({
      address: Address.createFromEthereum({
        value: walletAddress.toLowerCase(),
      }),
    })
    const user = User.createFrom({
      chainInfo,
      wallet,
    })

    const test = await backendSDK.armada.users.getUserPositions({
      user,
    })

    console.log('test', test)
    // const userPositionsAllNetworksCalls = await Promise.all(
    //   sdkSupportedNetworks.map(async (chainId) => {
    //     const chainInfo = getChainInfoByChainId(chainId)

    //     const wallet = Wallet.createFrom({
    //       address: Address.createFromEthereum({
    //         value: walletAddress.toLowerCase(),
    //       }),
    //     })
    //     const user = User.createFrom({
    //       chainInfo,
    //       wallet,
    //     })

    //     return await backendSDK.armada.users.getUserPositions({
    //       user,
    //     })
    //   }),
    // )

    // console.log('userPositionsAllNetworksCalls', userPositionsAllNetworksCalls)

    // const positionsList = userPositionsAllNetworksCalls.reduce(
    //   (acc, position) => [...acc, ...position],
    //   [],
    // )

    return {} as IArmadaPosition[] | undefined
  } catch (error) {
    throw new Error(`Failed to get users positions: ${error}`)
  }
}

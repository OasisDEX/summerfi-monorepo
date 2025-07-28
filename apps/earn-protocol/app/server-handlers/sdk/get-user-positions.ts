import { type IArmadaPosition, SupportedNetworkIds } from '@summerfi/app-types'
import { Address, getChainInfoByChainId, User, Wallet } from '@summerfi/sdk-common'

import { serverOnlyErrorHandler } from '@/app/server-handlers/error-handler'
import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'

export async function getUserPositions({ walletAddress }: { walletAddress: string }) {
  try {
    const userPositionsAllNetworksCalls = await Promise.all(
      Object.values(SupportedNetworkIds).map(async (chainId) => {
        const chainInfo = getChainInfoByChainId(Number(chainId))

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

    return positionsList as IArmadaPosition[] | undefined
  } catch (error) {
    return serverOnlyErrorHandler('getUserPositions', error as string)
  }
}

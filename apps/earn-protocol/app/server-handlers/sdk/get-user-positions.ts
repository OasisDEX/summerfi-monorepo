import { sdkSupportedChains } from '@summerfi/app-types'
import { type IArmadaPosition } from '@summerfi/sdk-client'
import { Address, getChainInfoByChainId, User, Wallet } from '@summerfi/sdk-common'
import { unstable_cache as unstableCache } from 'next/cache'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'
import { REVALIDATION_TIMES } from '@/constants/revalidations'

export async function getUserPositions({ walletAddress }: { walletAddress: string }) {
  try {
    const userPositionsAllNetworksCalls = await Promise.all(
      sdkSupportedChains.map(
        unstableCache(
          async (chainId) => {
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
          },
          [walletAddress],
          {
            revalidate: REVALIDATION_TIMES.PORTFOLIO_DATA,
            tags: [walletAddress.toLowerCase()],
          },
        ),
      ),
    )

    const positionsList = userPositionsAllNetworksCalls
      .filter(Boolean)
      .reduce((acc, position) => [...acc, ...position], [])

    return positionsList as IArmadaPosition[] | undefined
  } catch (error) {
    throw new Error(`Failed to get users positions: ${error}`)
  }
}

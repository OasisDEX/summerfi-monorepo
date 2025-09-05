import {
  type IArmadaPosition,
  type IChainInfo,
  type IToken,
  type IUser,
} from '@summerfi/sdk-common'
import type { GetUserPositionsQuery } from '@summerfi/subgraph-manager-common'
import { mapGraphDataToArmadaPosition } from './mapGraphDataToArmadaPosition'
import type { IArmadaManagerMerklRewards } from '@summerfi/armada-protocol-common'

export const parseGetUserPositionsQuery = async ({
  user,
  query,
  summerToken,
  getTokenBySymbol,
  getUserMerklRewards,
}: {
  user: IUser
  query: GetUserPositionsQuery
  summerToken: IToken
  getTokenBySymbol: (params: { chainInfo: IChainInfo; symbol: string }) => IToken
  getUserMerklRewards: (
    params: Parameters<IArmadaManagerMerklRewards['getUserMerklRewards']>[0],
  ) => ReturnType<IArmadaManagerMerklRewards['getUserMerklRewards']>
}): Promise<IArmadaPosition[]> => {
  const chainInfo = user.chainInfo

  const merklSummerRewards = await getUserMerklRewards({
    address: user.wallet.address.value,
    chainIds: [user.chainInfo.chainId],
    rewardsTokensAddresses: [summerToken.address.value],
  })

  return query.positions.map(
    mapGraphDataToArmadaPosition({
      user,
      chainInfo,
      summerToken,
      getTokenBySymbol,
      merklSummerRewards,
    }),
  )
}

import {
  type IArmadaPosition,
  type IChainInfo,
  type IToken,
  type IUser,
} from '@summerfi/sdk-common'
import type { GetUserPositionQuery, GetPositionQuery } from '@summerfi/subgraph-manager-common'
import { mapGraphDataToArmadaPosition } from './mapGraphDataToArmadaPosition'
import type { IArmadaManagerMerklRewards } from '@summerfi/armada-protocol-common'

export const parseGetUserPositionQuery = async ({
  user,
  query,
  summerToken,
  getTokenBySymbol,
  getUserMerklRewards,
}: {
  user: IUser
  query: GetUserPositionQuery | GetPositionQuery
  summerToken: IToken
  getTokenBySymbol: (params: { chainInfo: IChainInfo; symbol: string }) => IToken
  getUserMerklRewards: (
    params: Parameters<IArmadaManagerMerklRewards['getUserMerklRewards']>[0],
  ) => ReturnType<IArmadaManagerMerklRewards['getUserMerklRewards']>
}): Promise<IArmadaPosition | undefined> => {
  const chainInfo = user.chainInfo

  const merklSummerRewards = await getUserMerklRewards({
    address: user.wallet.address.value,
    chainIds: [user.chainInfo.chainId],
    rewardsTokensAddresses: [summerToken.address.value],
  })

  const armadaPositions = query.positions.map(
    mapGraphDataToArmadaPosition({
      user,
      chainInfo,
      summerToken,
      getTokenBySymbol,
      merklSummerRewards,
    }),
  )
  return armadaPositions[0] ? armadaPositions[0] : undefined
}

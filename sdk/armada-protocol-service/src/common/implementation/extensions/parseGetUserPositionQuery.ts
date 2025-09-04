import {
  type IArmadaPosition,
  type IChainInfo,
  type IToken,
  type IUser,
} from '@summerfi/sdk-common'
import type { GetUserPositionQuery } from '@summerfi/subgraph-manager-common'
import { mapGraphDataToArmadaPosition } from './mapGraphDataToArmadaPosition'

export const parseGetUserPositionQuery = ({
  user,
  query,
  summerToken,
  getTokenBySymbol,
}: {
  user: IUser
  query: GetUserPositionQuery
  summerToken: IToken
  getTokenBySymbol: (params: { chainInfo: IChainInfo; symbol: string }) => IToken
}): IArmadaPosition | undefined => {
  const chainInfo = user.chainInfo
  // TODO: pass a callback to fetch merkl rewards (rewards manager => getUserMerklRewards)
  // in the response parse campaigns breakdowns data
  // then map each campaign data to their respective vault

  const armadaPositions = query.positions.map(
    mapGraphDataToArmadaPosition({ user, chainInfo, summerToken, getTokenBySymbol }),
  )
  return armadaPositions[0] ? armadaPositions[0] : undefined
}

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
  const armadaPositions = query.positions.map(
    mapGraphDataToArmadaPosition({ user, chainInfo, summerToken, getTokenBySymbol }),
  )
  return armadaPositions[0] ? armadaPositions[0] : undefined
}

import {
  type IArmadaPosition,
  type IChainInfo,
  type IToken,
  type IUser,
} from '@summerfi/sdk-common'
import type { GetUserPositionsQuery } from '@summerfi/subgraph-manager-common'
import { mapGraphDataToArmadaPosition } from './mapGraphDataToArmadaPosition'

export const parseGetUserPositionsQuery = ({
  user,
  query,
  summerToken,
  getTokenBySymbol,
}: {
  user: IUser
  query: GetUserPositionsQuery
  summerToken: IToken
  getTokenBySymbol: (params: { chainInfo: IChainInfo; symbol: string }) => IToken
}): IArmadaPosition[] => {
  const chainInfo = user.chainInfo
  return query.positions.map(
    mapGraphDataToArmadaPosition({ user, chainInfo, summerToken, getTokenBySymbol }),
  )
}

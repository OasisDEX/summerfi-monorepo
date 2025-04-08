import type { IArmadaPosition } from '@summerfi/armada-protocol-common'
import { type IToken, type IUser } from '@summerfi/sdk-common'
import type { GetUserPositionsQuery } from '@summerfi/subgraph-manager-common'
import { mapGraphDataToArmadaPosition } from './mapGraphDataToArmadaPosition'

export const parseGetUserPositionsQuery = ({
  user,
  query,
  summerToken,
}: {
  user: IUser
  query: GetUserPositionsQuery
  summerToken: IToken
}): IArmadaPosition[] => {
  const chainInfo = user.chainInfo
  return query.positions.map(mapGraphDataToArmadaPosition({ user, chainInfo, summerToken }))
}

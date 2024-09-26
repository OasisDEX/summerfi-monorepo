import type { IArmadaPosition } from '@summerfi/armada-protocol-common'
import { type IUser } from '@summerfi/sdk-common'
import type { GetUserPositionsQuery } from '@summerfi/subgraph-manager-common'
import { mapGraphDataToArmadaPosition } from './mapGraphDataToArmadaPosition'

export const parseGetUserPositionsQuery = ({
  user,
  query,
}: {
  user: IUser
  query: GetUserPositionsQuery
}): IArmadaPosition[] => {
  const chainInfo = user.chainInfo
  return query.positions.map(mapGraphDataToArmadaPosition({ user, chainInfo }))
}

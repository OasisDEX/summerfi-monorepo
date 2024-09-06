import type { IArmadaPosition } from '@summerfi/armada-protocol-common'
import { type IUser } from '@summerfi/sdk-common'
import type { GetUserPositionQuery } from '@summerfi/subgraph-manager-common'
import { mapGraphDataToArmadaPosition } from './mapGraphDataToArmadaPosition'

export const parseGetUserPositionQuery = ({
  user,
  query,
}: {
  user: IUser
  query: GetUserPositionQuery
}): IArmadaPosition => {
  const chainInfo = user.chainInfo
  const armadaPositions = query.positions.map(mapGraphDataToArmadaPosition({ user, chainInfo }))
  return armadaPositions[0]
}

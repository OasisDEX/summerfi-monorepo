import type { IArmadaPosition } from '@summerfi/armada-protocol-common'
import { type IToken, type IUser } from '@summerfi/sdk-common'
import type { GetUserPositionQuery } from '@summerfi/subgraph-manager-common'
import { mapGraphDataToArmadaPosition } from './mapGraphDataToArmadaPosition'

export const parseGetUserPositionQuery = ({
  user,
  query,
  summerToken,
}: {
  user: IUser
  query: GetUserPositionQuery
  summerToken: IToken
}): IArmadaPosition => {
  const chainInfo = user.chainInfo
  const armadaPositions = query.positions.map(
    mapGraphDataToArmadaPosition({ user, chainInfo, summerToken }),
  )
  return armadaPositions[0]
}

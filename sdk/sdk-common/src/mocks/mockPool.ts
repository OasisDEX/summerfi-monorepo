import { Maybe } from '../common/aliases/Maybe'
import { Percentage } from '../common/implementation/Percentage'
import { LendingPoolImpl } from '../protocols/implementation/LendingPoolBaseImpl'
import { LendingPool } from '../protocols/interfaces/LendingPool'
import { isLendingPoolParameters } from '../protocols/interfaces/LendingPoolParameters'
import { PoolParameters } from '../protocols/interfaces/PoolParameters'
import { Protocol } from '../protocols/interfaces/Protocol'
import { ProtocolParameters } from '../protocols/interfaces/ProtocolParameters'

export async function mockPool(params: {
  protocol: Protocol
  poolParameters: PoolParameters
  protocolParameters?: ProtocolParameters
}): Promise<Maybe<LendingPool>> {
  if (isLendingPoolParameters(params.poolParameters)) {
    return new LendingPoolImpl({
      poolId: { id: 'mock' },
      protocol: params.protocol.name,
      maxLTV: Percentage.createFrom({ percentage: 50.3 }),
      debtTokens: params.poolParameters.debtTokens,
      collateralTokens: params.poolParameters.collateralTokens,
    })
  }

  return undefined
}

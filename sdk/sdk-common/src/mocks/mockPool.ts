import { Maybe } from '../common/aliases/Maybe'
import { Percentage } from '../common/implementation/Percentage'
import { LendingPoolImpl } from '../protocols/implementation/LendingPoolBaseImpl'
import { Protocol } from '../protocols/implementation/Protocol'
import { LendingPool } from '../protocols/interfaces/LendingPool'
import { isLendingPoolParameters } from '../protocols/interfaces/LendingPoolParameters'
import { PoolParameters } from '../protocols/interfaces/PoolParameters'
import { ProtocolParameters } from '../protocols/interfaces/ProtocolParameters'

export async function mockPool(params: {
  protocol: Protocol
  poolParameters: PoolParameters
  protocolParameters?: ProtocolParameters
}): Promise<Maybe<LendingPool>> {
  if (isLendingPoolParameters(params.poolParameters)) {
    return new LendingPoolImpl({
      poolId: { id: 'mock' },
      protocol: params.protocol,
      maxLTV: Percentage.createFrom({ percentage: 50.3 }),
      debts: [],
      collaterals: [],
    })
  }

  return undefined
}

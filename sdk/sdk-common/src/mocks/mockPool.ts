import { Percentage } from '~sdk-common/common/implementation/Percentage'

import { LendingPoolImpl } from '~sdk-common/protocols/implementation'
import type { Maybe } from '~sdk-common/common/aliases'
import { isLendingPoolParameters } from '~sdk-common/protocols/interfaces/LendingPoolParameters'
import type { PoolParameters } from '~sdk-common/protocols/interfaces/PoolParameters'
import type { Protocol } from '~sdk-common/protocols/interfaces/Protocol'
import type { ProtocolParameters } from '~sdk-common/protocols/interfaces/ProtocolParameters'
import type { LendingPool } from '~sdk-common/protocols/interfaces/LendingPool'

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
      debts: [],
      collaterals: [],
    })
  }

  return undefined
}

import { Percentage } from '~sdk-common/common/implementation/Percentage'

import type { Maybe } from '~sdk-common/common/aliases'
import { isLendingPoolParameters } from '~sdk-common/protocols/interfaces/LendingPoolParameters'
import type { PoolParameters } from '~sdk-common/protocols/interfaces/PoolParameters'
import type { Protocol } from '~sdk-common/protocols/interfaces/Protocol'
import type { ProtocolParameters } from '~sdk-common/protocols/interfaces/ProtocolParameters'
import { LendingPool } from '~sdk-common/protocols/implementation/LendingPool'
import { ProtocolName, SparkPoolId } from '~sdk-common/protocols'

export async function mockPool(params: {
  protocol: Protocol
  poolParameters: PoolParameters
  protocolParameters?: ProtocolParameters
}): Promise<Maybe<LendingPool>> {
  if (isLendingPoolParameters(params.poolParameters)) {
    return new LendingPool({
      poolId: { protocol: ProtocolName.Spark, id: 'mock' } as SparkPoolId,
      protocol: params.protocol.name,
      maxLTV: Percentage.createFrom({ percentage: 50.3 }),
      debtTokens: params.poolParameters.debtTokens,
      collateralTokens: params.poolParameters.collateralTokens,
    })
  }

  return undefined
}

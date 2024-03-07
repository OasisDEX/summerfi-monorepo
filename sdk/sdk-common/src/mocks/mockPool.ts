import { Maybe } from '../common/aliases/Maybe'
import { Percentage } from '../common/implementation/Percentage'
import { ProtocolName } from '../protocols/enums/ProtocolName'
import { LendingPool } from '../protocols/implementation/LendingPool'
import { Protocol } from '../protocols/implementation/Protocol'
import { isLendingPoolParameters } from '../protocols/interfaces/LendingPoolParameters'
import { PoolParameters } from '../protocols/interfaces/PoolParameters'
import { ProtocolParameters } from '../protocols/interfaces/ProtocolParameters'
import { EmodeType, SparkPoolId } from '../protocols/interfaces/SparkPoolId'

export async function mockPool(params: {
  protocol: Protocol
  poolParameters: PoolParameters
  protocolParameters?: ProtocolParameters
}): Promise<Maybe<LendingPool>> {
  if (isLendingPoolParameters(params.poolParameters)) {
    return new LendingPool({
      poolId: {
        protocol: ProtocolName.Spark,
        emodeType: EmodeType.None,
      } as SparkPoolId,
      protocol: params.protocol,
      maxLTV: Percentage.createFrom({ percentage: 50.3 }),
      debtTokens: params.poolParameters.debtTokens,
      collateralTokens: params.poolParameters.collateralTokens,
    })
  }

  return undefined
}

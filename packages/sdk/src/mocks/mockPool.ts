import { Percentage } from '~sdk/common'
import {
  LendingPoolImpl,
  Pool,
  PoolParameters,
  Protocol,
  ProtocolParameters,
  isLendingPoolParameters,
} from '~sdk/protocols'
import { Maybe } from '~sdk/utils'

export async function mockPool(params: {
  protocol: Protocol
  poolParameters: PoolParameters
  protocolParameters?: ProtocolParameters
}): Promise<Maybe<Pool>> {
  if (isLendingPoolParameters(params.poolParameters)) {
    return new LendingPoolImpl({
      poolId: { id: 'mock' },
      protocolId: params.protocol.protocolId,
      maxLTV: Percentage.createFrom({ percentage: 50.3 }),
      debtTokens: params.poolParameters.debtTokens,
      collateralTokens: params.poolParameters.collateralTokens,
    })
  }

  return undefined
}

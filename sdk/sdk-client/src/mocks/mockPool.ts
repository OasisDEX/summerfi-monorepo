import { type Maybe, Percentage } from '@summerfi/sdk-common/common'
import {
  type Protocol,
  type ProtocolParameters,
  type LendingPool,
  isLendingPoolParameters,
  LendingPoolImpl,
  type LendingPoolParameters,
} from '@summerfi/sdk-common/protocols'

export async function mockPool(params: {
  protocol: Protocol
  poolParameters: LendingPoolParameters
  protocolParameters?: ProtocolParameters
}): Promise<Maybe<LendingPool>> {
  if (isLendingPoolParameters(params.poolParameters)) {
    return new LendingPoolImpl({
      poolId: { id: 'mock' },
      protocol: params.protocol,
      maxLTV: Percentage.createFrom({ percentage: 50.3 }),
      debtTokens: params.poolParameters.debtTokens,
      collateralTokens: params.poolParameters.collateralTokens,
    })
  }

  return undefined
}

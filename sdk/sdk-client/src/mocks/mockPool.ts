import { type Maybe, CurrencySymbol } from '@summerfi/sdk-common/common'
import {
  type Protocol,
  type ProtocolParameters,
  LendingPool,
  isLendingPoolParameters,
  type LendingPoolParameters,
  ProtocolName,
  EmodeType,
  SparkPoolId,
} from '@summerfi/sdk-common/protocols'

export async function mockPool(params: {
  protocol: Protocol
  poolParameters: LendingPoolParameters
  protocolParameters?: ProtocolParameters
}): Promise<Maybe<LendingPool>> {
  if (isLendingPoolParameters(params.poolParameters)) {
    return new LendingPool({
      poolId: {
        protocol: ProtocolName.Spark,
        emodeType: EmodeType.None,
      } as SparkPoolId,
      protocol: params.protocol,
      baseCurrency: CurrencySymbol.USD,
      // maxLTV: Percentage.createFrom({ percentage: 50.3 }),
      debts: params.poolParameters.debts,
      collaterals: params.poolParameters.collaterals,
    })
  }

  return undefined
}

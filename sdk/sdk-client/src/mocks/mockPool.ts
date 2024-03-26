import {
  type Maybe,
  CurrencySymbol,
  ChainInfo,
  AddressValue,
  Percentage,
  RiskRatio,
  RiskRatioType,
} from '@summerfi/sdk-common/common'
import {
  type ProtocolParameters,
  LendingPool,
  isLendingPoolParameters,
  type LendingPoolParameters,
  ProtocolName,
  EmodeType,
  SparkPoolId,
  PoolType,
} from '@summerfi/sdk-common/protocols'
import { Protocol } from '../implementation/Protocol'
import {
  ISparkCollateralConfigRecord,
  ISparkDebtConfigRecord,
  SparkLendingPool,
} from '@summerfi/protocol-plugins'

export async function mockPool(params: {
  protocol: Protocol
  poolParameters: LendingPoolParameters
  protocolParameters?: ProtocolParameters
}): Promise<Maybe<LendingPool>> {
  if (!isLendingPoolParameters(params.poolParameters)) {
    return undefined
  }

  const sparkDebtConfig = Object.entries(params.poolParameters.debts.record).reduce(
    (acc, [key, value]) => {
      acc[key as AddressValue] = {
        ...value,
        borrowingEnabled: true,
      }
      return acc
    },
    {} as ISparkDebtConfigRecord,
  )

  const sparkCollateralConfig = Object.entries(params.poolParameters.collaterals.record).reduce(
    (acc, [key, value]) => {
      acc[key as AddressValue] = {
        ...value,
        usageAsCollateralEnabled: true,
        apy: Percentage.createFrom({ value: 0.1 }),
        maxLtv: RiskRatio.createFrom({
          ratio: Percentage.createFrom({ value: 0.2 }),
          type: RiskRatioType.LTV,
        }),
      }
      return acc
    },
    {} as ISparkCollateralConfigRecord,
  )

  return SparkLendingPool.createFrom({
    type: PoolType.Lending,
    poolId: {
      protocol: {
        name: ProtocolName.Spark,
        chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
      },
      emodeType: EmodeType.None,
    } as SparkPoolId,
    protocol: params.protocol,
    baseCurrency: CurrencySymbol.USD,
    debts: {
      record: sparkDebtConfig,
    },
    collaterals: {
      record: sparkCollateralConfig,
    },
  })
}

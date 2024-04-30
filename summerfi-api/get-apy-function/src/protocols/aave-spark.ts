import { Address, ProtocolId, Token } from '@summerfi/serverless-shared'
import { Logger } from '@aws-lambda-powertools/logger'
import { AaveSparkInterestRateResult } from '@summerfi/aave-spark-subgraph'
import { calculateBorrowRates } from './borrow-rates'
import { CustomDate } from '../helpers'
import { ProtocolResponse } from './types'
import { calculateSupplyRates } from './supply-rates'

export interface AaveSparkProtocolData {
  collateralToken: Token
  debtToken: Token
}

export const getAaveSparkRates = async (params: {
  collateralToken: Address
  debtToken: Address
  protocol: ProtocolId.SPARK | ProtocolId.AAVE_V3 | ProtocolId.AAVE_V2 | ProtocolId.AAVE3
  aaveSubgraphSupplyRatesResponse: AaveSparkInterestRateResult
  aaveSubgraphBorrowRatesResponse: AaveSparkInterestRateResult
  timestamp: CustomDate
  logger: Logger
}): Promise<ProtocolResponse<AaveSparkProtocolData>> => {
  const { aaveSubgraphSupplyRatesResponse, aaveSubgraphBorrowRatesResponse } = params

  const borrowRates = calculateBorrowRates(aaveSubgraphBorrowRatesResponse)
  const supplyRates = calculateSupplyRates(aaveSubgraphSupplyRatesResponse)

  const collateralToken = {
    address: aaveSubgraphSupplyRatesResponse.token.address,
    symbol: aaveSubgraphSupplyRatesResponse.token.symbol,
    decimals: aaveSubgraphSupplyRatesResponse.token.decimals,
  }

  const debtToken = {
    address: aaveSubgraphBorrowRatesResponse.token.address,
    symbol: aaveSubgraphBorrowRatesResponse.token.symbol,
    decimals: aaveSubgraphBorrowRatesResponse.token.decimals,
  }
  return {
    borrowRates,
    supplyRates,
    protocol: params.protocol,
    protocolData: {
      collateralToken,
      debtToken,
    },
    tokens: {
      supplied: collateralToken,
      borrowed: debtToken,
    },
  }
}

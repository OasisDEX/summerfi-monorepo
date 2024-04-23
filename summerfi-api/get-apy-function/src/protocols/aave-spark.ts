import { Address, ProtocolId, Token } from '@summerfi/serverless-shared'
import { Logger } from '@aws-lambda-powertools/logger'
import { AaveSparkSubgraphClient } from '@summerfi/aave-spark-subgraph'
import { calculateBorrowRates } from './borrow-rates'
import { CustomDate, getTimestamp, oneYearAgo } from '../helpers'
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
  timestamp: CustomDate
  logger: Logger
  subgraphClient: AaveSparkSubgraphClient
}): Promise<ProtocolResponse<AaveSparkProtocolData>> => {
  const earliestTimestamp = oneYearAgo(params.timestamp)
  const timestamp = getTimestamp(params.timestamp)

  const aaveSubgraphSupplyRatesResponse = await params.subgraphClient.getInterestRate({
    token: params.collateralToken,
    protocol: params.protocol,
    fromTimestamp: earliestTimestamp,
    toTimestamp: timestamp,
  })

  const aaveSubgraphBorrowRatesResponse = await params.subgraphClient.getInterestRate({
    token: params.debtToken,
    protocol: params.protocol,
    fromTimestamp: earliestTimestamp,
    toTimestamp: timestamp,
  })

  const borrowRates = calculateBorrowRates(aaveSubgraphBorrowRatesResponse, params.timestamp)
  const supplyRates = calculateSupplyRates(aaveSubgraphSupplyRatesResponse, params.timestamp)

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

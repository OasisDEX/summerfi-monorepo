import { ProtocolId, Token } from '@summerfi/serverless-shared'
import { MorphoBlueSubgraphClient } from '@summerfi/morpho-blue-subgraph/dist'
import { Logger } from '@aws-lambda-powertools/logger'
import { CustomDate, getTimestamp, oneYearAgo } from '../helpers'
import { calculateBorrowRates } from './borrow-rates'
import { calculateSupplyRates } from './supply-rates'
import { ProtocolResponse } from './types'

export interface MorphoBlueProtocolData {
  market: `0x${string}`
  collateralToken: Token
  debtToken: Token
}

export const getMorphoBlueRates = async (params: {
  marketId: `0x${string}`
  timestamp: CustomDate
  logger: Logger
  subgraphClient: MorphoBlueSubgraphClient
}): Promise<ProtocolResponse<MorphoBlueProtocolData>> => {
  const earliestTimestamp = oneYearAgo(params.timestamp)
  const timestamp = getTimestamp(params.timestamp)

  const morphoSubgraphResponse = await params.subgraphClient.getInterestRate({
    marketId: params.marketId,
    fromTimestamp: earliestTimestamp,
    toTimestamp: timestamp,
  })

  const borrowRates = calculateBorrowRates(morphoSubgraphResponse, params.timestamp)
  const supplyRates = calculateSupplyRates(morphoSubgraphResponse, params.timestamp)

  const collateralToken = {
    address: morphoSubgraphResponse.collateralToken.address,
    symbol: morphoSubgraphResponse.collateralToken.symbol,
    decimals: morphoSubgraphResponse.collateralToken.decimals,
  }

  const debtToken = {
    address: morphoSubgraphResponse.debtToken.address,
    symbol: morphoSubgraphResponse.debtToken.symbol,
    decimals: morphoSubgraphResponse.debtToken.decimals,
  }

  return {
    borrowRates,
    supplyRates,
    protocol: ProtocolId.MORPHO_BLUE,
    protocolData: {
      market: morphoSubgraphResponse.marketId,
      collateralToken,
      debtToken,
    },
    tokens: {
      borrowed: debtToken,
      supplied: collateralToken,
    },
  }
}

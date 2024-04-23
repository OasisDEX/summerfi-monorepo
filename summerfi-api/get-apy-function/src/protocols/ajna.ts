import { Logger } from '@aws-lambda-powertools/logger'
import { AjnaSubgraphClient } from '@summerfi/ajna-subgraph'
import { CustomDate, getTimestamp, oneYearAgo } from '../helpers'
import { calculateBorrowRates } from './borrow-rates'
import { calculateSupplyRates } from './supply-rates'
import { Address, ProtocolId, Token } from '@summerfi/serverless-shared'
import { ProtocolResponse } from './types'

export interface AjnaProtocolData {
  poolId: Address
  quoteToken: Token
  collateralToken: Token
}

export const getAjnaRates = async (params: {
  poolId: `0x${string}`
  timestamp: CustomDate
  logger: Logger
  subgraphClient: AjnaSubgraphClient
}): Promise<ProtocolResponse<AjnaProtocolData>> => {
  const earliestTimestamp = oneYearAgo(params.timestamp)
  const timestamp = getTimestamp(params.timestamp)

  const ajnaSubgraphResponse = await params.subgraphClient.getInterestRate({
    poolId: params.poolId,
    fromTimestamp: earliestTimestamp,
    toTimestamp: timestamp,
  })

  const borrowRates = calculateBorrowRates(ajnaSubgraphResponse, params.timestamp)
  const supplyRates = calculateSupplyRates(ajnaSubgraphResponse, params.timestamp)

  const collateralToken = {
    address: ajnaSubgraphResponse.collateralToken.address,
    symbol: ajnaSubgraphResponse.collateralToken.symbol,
    decimals: ajnaSubgraphResponse.collateralToken.decimals,
  }

  const quoteToken = {
    address: ajnaSubgraphResponse.quoteToken.address,
    symbol: ajnaSubgraphResponse.quoteToken.symbol,
    decimals: ajnaSubgraphResponse.quoteToken.decimals,
  }

  return {
    borrowRates,
    supplyRates,
    protocol: ProtocolId.AJNA,
    protocolData: {
      poolId: ajnaSubgraphResponse.poolId,
      quoteToken,
      collateralToken,
    },
    tokens: {
      borrowed: quoteToken,
      supplied: collateralToken,
    },
  }
}

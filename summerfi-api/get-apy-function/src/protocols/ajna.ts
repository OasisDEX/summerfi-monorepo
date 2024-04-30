import { Logger } from '@aws-lambda-powertools/logger'
import { AjnaPoolInterestRateResult } from '@summerfi/ajna-subgraph'
import { CustomDate } from '../helpers'
import { calculateBorrowRates } from './borrow-rates'
import { calculateSupplyRates } from './supply-rates'
import { Address, ProtocolId, Token } from '@summerfi/serverless-shared'
import { GroupedRates, ProtocolResponse } from './types'
import { PositionMode } from '../contracts'

export interface AjnaProtocolData {
  poolId: Address
  quoteToken: Token
  collateralToken: Token
}

export const getAjnaRates = async (params: {
  poolId: `0x${string}`
  positionMode: PositionMode
  timestamp: CustomDate
  logger: Logger
  ajnaSubgraphResponse: AjnaPoolInterestRateResult
}): Promise<ProtocolResponse<AjnaProtocolData>> => {
  const { ajnaSubgraphResponse } = params

  const borrowRates =
    params.positionMode === PositionMode.Borrow
      ? calculateBorrowRates(ajnaSubgraphResponse)
      : (new Map() as GroupedRates)
  const supplyRates =
    params.positionMode === PositionMode.Supply
      ? calculateSupplyRates(ajnaSubgraphResponse)
      : (new Map() as GroupedRates)

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

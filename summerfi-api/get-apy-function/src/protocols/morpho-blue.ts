import { ProtocolId, Token } from '@summerfi/serverless-shared'
import { MorphoBlueMarketInterestRateResult } from '@summerfi/morpho-blue-subgraph/dist'
import { Logger } from '@aws-lambda-powertools/logger'
import { CustomDate } from '../helpers'
import { calculateBorrowRates } from './borrow-rates'
import { calculateSupplyRates } from './supply-rates'
import { GroupedRates, ProtocolResponse } from './types'
import { PositionMode } from '../contracts'

export interface MorphoBlueProtocolData {
  market: `0x${string}`
  collateralToken: Token
  debtToken: Token
}

export const getMorphoBlueRates = async (params: {
  marketId: `0x${string}`
  positionMode: PositionMode
  timestamp: CustomDate
  morphoSubgraphResponse: MorphoBlueMarketInterestRateResult
  logger: Logger
}): Promise<ProtocolResponse<MorphoBlueProtocolData>> => {
  const borrowRates =
    params.positionMode === PositionMode.Borrow
      ? calculateBorrowRates(params.morphoSubgraphResponse)
      : (new Map() as GroupedRates)
  const supplyRates =
    params.positionMode === PositionMode.Supply
      ? calculateSupplyRates(params.morphoSubgraphResponse)
      : (new Map() as GroupedRates)

  const collateralToken = {
    address: params.morphoSubgraphResponse.collateralToken.address,
    symbol: params.morphoSubgraphResponse.collateralToken.symbol,
    decimals: params.morphoSubgraphResponse.collateralToken.decimals,
  }

  const debtToken = {
    address: params.morphoSubgraphResponse.debtToken.address,
    symbol: params.morphoSubgraphResponse.debtToken.symbol,
    decimals: params.morphoSubgraphResponse.debtToken.decimals,
  }

  return {
    borrowRates,
    supplyRates,
    protocol: ProtocolId.MORPHO_BLUE,
    protocolData: {
      market: params.morphoSubgraphResponse.marketId,
      collateralToken,
      debtToken,
    },
    tokens: {
      borrowed: debtToken,
      supplied: collateralToken,
    },
  }
}

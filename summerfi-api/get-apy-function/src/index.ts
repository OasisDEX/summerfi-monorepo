import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import {
  ResponseBadRequest,
  ResponseInternalServerError,
  ResponseOk,
} from '@summerfi/serverless-shared/responses'
import { Logger } from '@aws-lambda-powertools/logger'
import {
  addressesSchema,
  addressSchema,
  ChainId,
  chainIdSchema,
  ltvSchema,
  ProtocolId,
  protocolIdSchema,
} from '@summerfi/serverless-shared'
import { z } from 'zod'
import { getMorphoBlueSubgraphClient } from '@summerfi/morpho-blue-subgraph'
import { getMorphoBlueApy } from './morpho-blue'
import { getAjnaSubgraphClient } from '@summerfi/ajna-subgraph'
import { getAjnaApy } from './ajna'

const logger = new Logger({ serviceName: 'get-apy-function' })

enum PositionMode {
  Supply = 'supply',
  Borrow = 'borrow',
}

const positionModeSchema = z
  .nativeEnum(PositionMode)
  .or(z.string())
  .refine((val) => z.nativeEnum(PositionMode).safeParse(val).success)
  .transform((val) => z.nativeEnum(PositionMode).parse(val))

const referenceDateSchema = z
  .date()
  .or(z.string().transform((val) => new Date(val)))
  .refine((val) => {
    return !isNaN(val.getTime())
  })

const aaveLikePositionSchema = z.object({
  collateral: addressesSchema,
  debt: addressesSchema,
  ltv: ltvSchema,
  referenceDate: referenceDateSchema,
})

const morphoBluePositionSchema = z.object({
  ltv: ltvSchema,
  marketId: z.custom<`0x${string}`>((val) => {
    if (typeof val !== 'string') {
      return false
    }
    const splitted = val.split('0x')
    if (splitted.length !== 2) {
      return false
    }
    const [, bytes] = splitted
    return bytes.length == 64
  }),
  mode: positionModeSchema,
  referenceDate: referenceDateSchema,
})

const ajnaPositionSchema = z.object({
  ltv: ltvSchema,
  poolAddress: addressSchema,
  mode: positionModeSchema,
  referenceDate: referenceDateSchema,
})

export const pathParamsSchema = z.object({
  chainId: chainIdSchema,
  protocol: protocolIdSchema,
})

type AaveLikePosition = z.infer<typeof aaveLikePositionSchema>
type MorphoBluePosition = z.infer<typeof morphoBluePositionSchema>
type AjnaPosition = z.infer<typeof ajnaPositionSchema>

interface ApyResponse {
  position: AaveLikePosition | MorphoBluePosition | AjnaPosition
  results: {
    apy: number
    apy7d: number
    apy30d: number
    apy90d: number
  }
  breakdowns: {
    borrowCost: {
      apy: number
      apy7d: number
      apy30d: number
      apy90d: number
    }
    supplyReward: {
      apy: number
      apy7d: number
      apy30d: number
      apy90d: number
    }
    underlyingBorrowedTokenYield: {
      apy: number
      apy7d: number
      apy30d: number
      apy90d: number
    }
    underlyingSuppliedTokenYield: {
      apy: number
      apy7d: number
      apy30d: number
      apy90d: number
    }
  }
  debug: unknown
}

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context,
): Promise<APIGatewayProxyResultV2> => {
  const RPC_GATEWAY = process.env.RPC_GATEWAY
  const SUBGRAPH_BASE = process.env.SUBGRAPH_BASE

  logger.addContext(context)
  if (!RPC_GATEWAY) {
    logger.error('RPC_GATEWAY is not set')
    return ResponseInternalServerError('RPC_GATEWAY is not set')
  }

  if (!SUBGRAPH_BASE) {
    logger.error('SUBGRAPH_BASE is not set')
    return ResponseInternalServerError('SUBGRAPH_BASE is not set')
  }

  logger.debug(`Query params`, { params: event.queryStringParameters })

  const path = pathParamsSchema.safeParse(event.pathParameters)

  if (!path.success) {
    logger.error('Invalid path parameters', { errors: path.error })
    return ResponseBadRequest({
      body: { message: 'Invalid path parameters', errors: path.error },
    })
  }

  const { protocol } = path.data

  let parser:
    | typeof aaveLikePositionSchema
    | typeof morphoBluePositionSchema
    | typeof ajnaPositionSchema
    | null = null

  let rates: unknown = null

  switch (protocol) {
    case ProtocolId.AAVE3:
    case ProtocolId.AAVE_V2:
    case ProtocolId.AAVE_V3:
    case ProtocolId.SPARK:
      parser = aaveLikePositionSchema
      break
    case ProtocolId.AJNA:
      parser = ajnaPositionSchema
      break
    case ProtocolId.MORPHO_BLUE:
      parser = morphoBluePositionSchema
  }

  if (!parser) {
    logger.error('Unsupported protocol', { protocol })
    return ResponseBadRequest({ body: { message: 'Unsupported protocol' } })
  }

  const positionData = parser.safeParse(event.queryStringParameters)

  if (!positionData.success) {
    return ResponseBadRequest({
      body: { message: 'Invalid query parameters', errors: positionData.error },
    })
  }

  if (protocol === ProtocolId.MORPHO_BLUE) {
    const positionData = morphoBluePositionSchema.safeParse(event.queryStringParameters)
    if (!positionData.success) {
      return ResponseBadRequest({
        body: { message: 'Invalid query parameters', errors: positionData.error },
      })
    }

    const client = getMorphoBlueSubgraphClient({
      logger: logger,
      chainId: ChainId.MAINNET,
      urlBase: SUBGRAPH_BASE,
    })

    const timestamp = Math.floor(positionData.data.referenceDate.getTime() / 1000)

    rates = await getMorphoBlueApy({
      ltv: positionData.data.ltv,
      marketId: positionData.data.marketId,
      timestamp,
      logger: logger,
      subgraphClient: client,
    })
  }

  if (protocol === ProtocolId.AJNA) {
    const positionData = ajnaPositionSchema.safeParse(event.queryStringParameters)
    if (!positionData.success) {
      return ResponseBadRequest({
        body: { message: 'Invalid query parameters', errors: positionData.error },
      })
    }

    const client = getAjnaSubgraphClient({
      logger: logger,
      chainId: path.data.chainId,
      urlBase: SUBGRAPH_BASE,
    })

    const timestamp = Math.floor(positionData.data.referenceDate.getTime() / 1000)

    rates = await getAjnaApy({
      ltv: positionData.data.ltv,
      poolId: positionData.data.poolAddress,
      timestamp,
      logger: logger,
      subgraphClient: client,
    })
  }

  const result: ApyResponse = {
    position: positionData.data,
    debug: rates,
    results: {
      apy: 0,
      apy7d: 0,
      apy30d: 0,
      apy90d: 0,
    },
    breakdowns: {
      borrowCost: {
        apy: 0,
        apy7d: 0,
        apy30d: 0,
        apy90d: 0,
      },
      supplyReward: {
        apy: 0,
        apy7d: 0,
        apy30d: 0,
        apy90d: 0,
      },
      underlyingBorrowedTokenYield: {
        apy: 0,
        apy7d: 0,
        apy30d: 0,
        apy90d: 0,
      },
      underlyingSuppliedTokenYield: {
        apy: 0,
        apy7d: 0,
        apy30d: 0,
        apy90d: 0,
      },
    },
  }

  return ResponseOk({ body: result })
}

export default handler

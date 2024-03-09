import { z } from 'zod'
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import {
  ResponseBadRequest,
  ResponseInternalServerError,
  ResponseOk,
} from '@summerfi/serverless-shared/responses'
import { chainIdSchema } from '@summerfi/serverless-shared/validators'

import { Logger } from '@aws-lambda-powertools/logger'
import {
  CollateralLocked,
  CollateralLockedResult,
  getAaveSparkSubgraphClient,
} from '@summerfi/aave-spark-subgraph'
import { Address, ChainId, isValidAddress } from '@summerfi/serverless-shared'
import { getAjnaSubgraphClient } from '@summerfi/ajna-subgraph'
import { getMorphoBlueSubgraphClient } from '@summerfi/morpho-blue-subgraph'
import { BigNumber } from 'bignumber.js'

const logger = new Logger({ serviceName: 'get-collateral-locked-function' })

export const addressesSchema = z
  .string()
  .transform((val) => val.split(','))
  .refine(
    (val) => {
      return val.every((address) => isValidAddress(address))
    },
    { message: 'Invalid format of addresses' },
  )
  .transform((val) => val.map((address) => address as Address))

const paramsSchema = z.object({
  address: addressesSchema.optional(),
  blockNumber: z
    .number()
    .positive()
    .or(z.string().refine((v) => !isNaN(Number(v))))
    .transform(Number),
  chainId: chainIdSchema,
})

const weETH_eETH_decimals = 18

const weETH_eETH_map: Record<ChainId, Address[]> = {
  [ChainId.MAINNET]: [
    '0x35fA164735182de50811E8e2E824cFb9B6118ac2', // eETH
    '0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee', // weETH
  ],
  [ChainId.OPTIMISM]: ['0x346e03F8Cce9fE01dCB3d0Da3e9D00dC2c0E08f0'],
  [ChainId.ARBITRUM]: ['0x35751007a407ca6FEFfE80b3cB397736D2cf4dbe'],
  [ChainId.BASE]: [],
  [ChainId.SEPOLIA]: [],
}

export interface ResponseBodyItem {
  address: Address
  effective_balance: number
}
export interface ResponseBody {
  Result: ResponseBodyItem[]
  TVL: number
}

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context,
): Promise<APIGatewayProxyResultV2> => {
  const SUBGRAPH_BASE = process.env.SUBGRAPH_BASE

  logger.addContext(context)

  if (!SUBGRAPH_BASE) {
    logger.error('SUBGRAPH_BASE is not set')
    return ResponseInternalServerError('SUBGRAPH_BASE is not set')
  }

  logger.info(`Query params`, { params: event.queryStringParameters })

  const parseResult = paramsSchema.safeParse(event.queryStringParameters)
  if (!parseResult.success) {
    logger.warn('Incorrect query params', {
      params: event.queryStringParameters,
      errors: parseResult.error.errors,
    })
    return ResponseBadRequest({
      message: 'Validation Errors',
      errors: parseResult.error.errors,
    })
  }
  const params = parseResult.data

  const calls: (() => Promise<CollateralLockedResult>)[] = []

  const aaveSparkClient = getAaveSparkSubgraphClient({
    chainId: params.chainId,
    urlBase: SUBGRAPH_BASE,
    logger,
  })

  calls.push(() =>
    aaveSparkClient
      .getCollateralLocked({
        collaterals: weETH_eETH_map[params.chainId].map((address) => {
          return {
            address,
            decimals: weETH_eETH_decimals,
          }
        }),
        blockNumber: params.blockNumber,
      })
      .catch((error) => {
        logger.error('Error fetching Aave/Spark collateral locked', { error })
        return {
          lockedCollaterals: [],
        }
      }),
  )

  const ajnaClient = getAjnaSubgraphClient({
    chainId: params.chainId,
    logger: logger,
    urlBase: SUBGRAPH_BASE,
  })

  calls.push(() =>
    ajnaClient
      .getCollateralLocked({
        collaterals: weETH_eETH_map[params.chainId].map((address) => {
          return {
            address,
            decimals: weETH_eETH_decimals,
          }
        }),
        blockNumber: params.blockNumber,
      })
      .then((result) => {
        return {
          lockedCollaterals: result.lockedCollaterals.map((lc) => {
            return {
              ...lc,
              amount: new BigNumber(lc.amount).shiftedBy(-weETH_eETH_decimals).toString(),
            }
          }),
        }
      })
      .catch((error) => {
        logger.error('Error fetching ajna collateral locked', { error })
        return {
          lockedCollaterals: [],
        }
      }),
  )

  if (params.chainId === ChainId.MAINNET) {
    const morphoBlueClient = getMorphoBlueSubgraphClient({
      chainId: ChainId.MAINNET,
      urlBase: SUBGRAPH_BASE,
      logger,
    })

    calls.push(() =>
      morphoBlueClient
        .getCollateralLocked({
          collaterals: weETH_eETH_map[params.chainId].map((address) => {
            return {
              address,
              decimals: weETH_eETH_decimals,
            }
          }),
          blockNumber: params.blockNumber,
        })
        .then((result) => {
          return {
            lockedCollaterals: result.lockedCollaterals.map((lc) => {
              return {
                ...lc,
                amount: new BigNumber(lc.amount).shiftedBy(-weETH_eETH_decimals).toString(),
              }
            }),
          }
        })
        .catch((error) => {
          logger.error('Error fetching morpho blue collateral locked', { error })
          return {
            lockedCollaterals: [],
          }
        }),
    )
  }

  const collateralLocked = await Promise.all(calls.map((c) => c()))

  const values: ResponseBodyItem[] = collateralLocked
    .flatMap((c) => c.lockedCollaterals)
    .reduce(
      (acc, c) => {
        const index = acc.findIndex((a) => a.owner === c.owner)
        if (index === -1) {
          return [...acc, { owner: c.owner, lockedCollaterals: [c] }]
        }
        acc[index].lockedCollaterals.push(c)
        return acc
      },
      [] as { owner: Address; lockedCollaterals: CollateralLocked[] }[],
    )
    .map((c) => {
      return {
        owner: c.owner,
        amount: c.lockedCollaterals
          .map((c) => c.amount)
          .reduce((acc, second) => acc.plus(new BigNumber(second)), new BigNumber(0))
          .toNumber(),
      }
    })
    .map((c) => {
      return {
        address: c.owner,
        effective_balance: c.amount,
      }
    })

  const tvl = values.map((v) => v.effective_balance).reduce((acc, second) => acc + second, 0)

  const filteredValues =
    params.address && params.address.length > 0
      ? values.filter((v) => params.address?.includes(v.address))
      : values

  const response: ResponseBody = {
    Result: filteredValues,
    TVL: tvl,
  }

  return ResponseOk({
    body: response,
  })
}

export default handler

import { Logger } from '@aws-lambda-powertools/logger'
import { IRpcConfig } from '@summerfi/serverless-shared/getRpcGatewayEndpoint'
import {
  ResponseBadRequest,
  ResponseInternalServerError,
  ResponseOk,
} from '@summerfi/serverless-shared/responses'
import { addressSchema, chainIdSchema } from '@summerfi/serverless-shared/validators'
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import { z } from 'zod'
import { fetchRewardsData } from './fetchRewardsData'
import type { RewardsData } from './types'
import { rewardsAbi } from './abi/rewards'

export const rpcConfig: IRpcConfig = {
  skipCache: false,
  skipMulticall: false,
  skipGraph: true,
  stage: 'prod',
  source: 'summerfi-api',
}

const logger = new Logger({ serviceName: 'spark-rewards-claim' })

const paramsSchema = z.object({
  account: addressSchema,
  chainId: chainIdSchema,
})

export type FunctionParams = z.infer<typeof paramsSchema>

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context,
): Promise<APIGatewayProxyResultV2> => {
  const RPC_GATEWAY = process.env.RPC_GATEWAY

  logger.addContext(context)
  if (!RPC_GATEWAY) {
    logger.error('RPC_GATEWAY is not set')
    return ResponseInternalServerError('RPC_GATEWAY is not set')
  }

  logger.info(`Query params`, { params: event.queryStringParameters })

  const parseResult = paramsSchema.safeParse(event.queryStringParameters)
  if (!parseResult.success) {
    return ResponseBadRequest({
      message: 'Validation Errors',
      errors: parseResult.error.errors,
    })
  }
  const params = parseResult.data

  let rewardsData: RewardsData[]
  try {
    rewardsData = await fetchRewardsData({
      account: params.account,
      chainId: params.chainId,
    })
  } catch (error: unknown) {
    logger.error('Failed to fetch rewards data', { error })
    return ResponseInternalServerError('Failed to fetch rewards data')
  }

  const multicallTxList = rewardsData.map((reward) => {
    return {
      address: reward.claimArgs.tokenAddress,
      abi: rewardsAbi,
      functionName: 'claim',
      args: [
        reward.claimArgs.epoch,
        reward.claimArgs.account,
        reward.claimArgs.tokenAddress,
        reward.claimArgs.amount,
        reward.claimArgs.rootHash,
        reward.claimArgs.proof,
      ],
    }
  })

  return ResponseOk({
    body: {
      claimTxList: multicallTxList,
    },
  })
}

export default handler

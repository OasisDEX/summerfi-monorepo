import { Logger } from '@aws-lambda-powertools/logger'
import { IRpcConfig } from '@summerfi/serverless-shared/getRpcGatewayEndpoint'
import {
  ResponseBadRequest,
  ResponseInternalServerError,
  ResponseOk,
} from '@summerfi/serverless-shared/responses'
import { addressSchema } from '@summerfi/serverless-shared/validators'
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import { z } from 'zod'
import { fetchRewardsData } from './fetchRewardsData'
import type { RewardsData } from './types'
import { claimAbi } from './abi/rewards'
import { getRewardsContractAddressByClaimType } from './mappings'
import { ChainId } from '@summerfi/serverless-shared'
import { encodeFunctionData, extractChain } from 'viem'
import { mainnet } from 'viem/chains'
import { multicall3Abi } from './abi/multicall3'

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
  const chainId = ChainId.MAINNET // Hardcoded for now, can be extended later

  let rewardsData: RewardsData[]
  try {
    rewardsData = await fetchRewardsData({
      account: params.account,
      chainId,
    })
  } catch (error: unknown) {
    logger.error('Failed to fetch rewards data', { error })
    return ResponseInternalServerError('Failed to fetch rewards data')
  }

  const multicallArgs = rewardsData.map((reward) => {
    return {
      allowFailure: false,
      target: getRewardsContractAddressByClaimType(reward.claimType, chainId),
      callData: encodeFunctionData({
        abi: claimAbi,
        functionName: 'claim',
        args: [
          reward.claimArgs.epoch,
          reward.claimArgs.account,
          reward.claimArgs.tokenAddress,
          reward.claimArgs.amount,
          reward.claimArgs.rootHash,
          reward.claimArgs.proof,
        ],
      }),
    }
  })

  const chain = extractChain({
    chains: [mainnet],
    id: chainId,
  })

  const multicallData = encodeFunctionData({
    abi: multicall3Abi,
    functionName: 'aggregate3',
    args: [multicallArgs],
  })
  const claimMulticallTransaction = {
    to: chain.contracts.multicall3.address,
    data: multicallData,
    value: 0,
  }

  return ResponseOk({
    body: {
      claimMulticallTransaction,
      calls: multicallArgs,
    },
  })
}

export default handler

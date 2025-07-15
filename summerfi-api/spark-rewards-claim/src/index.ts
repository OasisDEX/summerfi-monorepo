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
import { fetchRewardsData as fetchRewardsRecords } from './fetchRewardsData'
import type { RewardsData as RewardsRecord } from './types'
import { sparkRewardsAbi } from './abi/rewards'
import { getRewardsContractAddressByClaimType, assertValidRootHash } from './mappings'
import { ChainId, getRpcGatewayEndpoint } from '@summerfi/serverless-shared'
import { createPublicClient, encodeFunctionData, extractChain, http, type Hex } from 'viem'
import { mainnet } from 'viem/chains'
import { multicall3Abi } from './abi/multicall3'

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
  const SUBGRAPH_BASE = process.env.SUBGRAPH_BASE
  const STAGE = process.env.STAGE

  if (!RPC_GATEWAY) {
    return ResponseInternalServerError('RPC_GATEWAY is not set')
  }
  if (!SUBGRAPH_BASE) {
    return ResponseInternalServerError('SUBGRAPH_BASE is not set')
  }
  if (!STAGE) {
    return ResponseInternalServerError('NODE_ENV is not set')
  }

  logger.addContext(context)
  logger.info(`Query params`, { params: event.queryStringParameters })

  const rpcConfig: IRpcConfig = {
    skipCache: false,
    skipMulticall: false,
    skipGraph: true,
    stage: STAGE,
    source: 'summerfi-api',
  }

  const parseResult = paramsSchema.safeParse(event.queryStringParameters)
  if (!parseResult.success) {
    return ResponseBadRequest({
      message: 'Validation Errors',
      errors: parseResult.error.errors,
    })
  }
  const params = parseResult.data
  const chainId = ChainId.MAINNET // Hardcoded for now, can be extended later
  const chain = extractChain({
    chains: [mainnet],
    id: chainId,
  })

  const rpcUrl = getRpcGatewayEndpoint(RPC_GATEWAY, chainId, rpcConfig)
  const transport = http(rpcUrl, {
    batch: true,
    fetchOptions: {
      method: 'POST',
    },
  })
  const publicClient = createPublicClient({
    chain,
    transport,
    batch: {
      multicall: true,
    },
  })

  let rewardsRecords: RewardsRecord[]
  try {
    rewardsRecords = await fetchRewardsRecords({
      account: params.account,
      chainId,
    })
  } catch (error: unknown) {
    logger.error('Failed to fetch rewards data', { error })
    return ResponseInternalServerError('Failed to fetch rewards data')
  }

  // const rewardsByType = rewardsRecordList.reduce(
  //   (acc, reward) => {
  //     if (!acc[reward.claimType]) {
  //       acc[reward.claimType] = []
  //     }
  //     acc[reward.claimType].push(reward)
  //     return acc
  //   },
  //   {} as Record<ClaimType, RewardsRecord[]>,
  // )

  // for (const [claimType, rewardsOfType] of Object.entries(rewardsByType)) {
  //   if (rewardsOfType.length === 0) {
  //     logger.info(`No rewards to claim for claim type: ${claimType}`)
  //     continue
  //   }

  //   logger.info(`Processing rewards for claim type: ${claimType}`, {
  //     count: rewardsOfType.length,
  //   })

  //   return
  // }

  // check if can claim
  const cumulativeRewardAmount = rewardsRecords.reduce((acc, reward) => {
    return acc + reward.claimArgs.amount
  }, BigInt(0))
  const claimedPerReward = await publicClient.multicall({
    contracts: rewardsRecords.map((reward) => {
      return {
        address: getRewardsContractAddressByClaimType(reward.claimType, chainId),
        abi: sparkRewardsAbi,
        functionName: 'cumulativeClaimed',
        args: [params.account, reward.claimArgs.tokenAddress, reward.claimArgs.epoch],
      } as const
    }),
    allowFailure: false,
  })
  const cumulativeClaimed = claimedPerReward.reduce((acc, curr) => {
    return acc + curr
  }, BigInt(0))
  const canClaim = cumulativeRewardAmount > cumulativeClaimed

  let claimMulticallTransaction: { to: Hex; data: Hex; value: string } | undefined
  let calls: { allowFailure: boolean; target: Hex; callData: Hex }[] | undefined

  if (canClaim) {
    try {
      calls = rewardsRecords.map((reward) => {
        const target = getRewardsContractAddressByClaimType(reward.claimType, chainId)
        assertValidRootHash(reward.claimArgs.rootHash, chainId)

        return {
          allowFailure: true,
          target,
          callData: encodeFunctionData({
            abi: sparkRewardsAbi,
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
    } catch (error: unknown) {
      return ResponseInternalServerError(
        'Failed to prepare claim calls: ' + (error as Error).message,
      )
    }

    const multicallData = encodeFunctionData({
      abi: multicall3Abi,
      functionName: 'aggregate3',
      args: [calls],
    })
    claimMulticallTransaction = {
      to: chain.contracts.multicall3.address,
      data: multicallData,
      value: '0',
    }
  }

  return ResponseOk({
    body: {
      canClaim,
      cumulativeToClaim: cumulativeRewardAmount.toString(),
      cumulativeClaimed: cumulativeClaimed.toString(),
      claimMulticallTransaction,
      calls,
    },
  })
}

export default handler

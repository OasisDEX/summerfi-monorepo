import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import { ResponseInternalServerError, ResponseOk } from '@summerfi/serverless-shared/responses'
import { SummerTokenAbi } from '@summerfi/armada-protocol-abis'
import { Logger } from '@aws-lambda-powertools/logger'
import { z } from 'zod'
import { addressSchema, ChainId } from '@summerfi/serverless-shared'
import { checkOKXQuestsUpTo } from './campaigns/okx/handler'
import type { CampaignResponse } from './types'
import { getCampaignData } from '@summerfi/summer-earn-protocol-subgraph'
import { base } from 'viem/chains'
import { createPublicClient, http } from 'viem'
import { isOkxCampaignWallet } from './db'

const logger = new Logger({ serviceName: 'get-campaign-data-function' })

const pathParamsSchema = z.object({
  campaign: z.enum(['okx']),
  questNumber: z.coerce.number().int().min(1).max(4),
  walletAddress: addressSchema,
})

// Both these functions are limited to the Base chain for now
// I'm leaving them here for possible future expansion
const getChainConfig = (chainId: ChainId) => {
  logger.info(`Getting chain configuration for chain ID: ${chainId}`)
  switch (chainId) {
    case ChainId.BASE:
      return base
    default:
      logger.error(`Unsupported campaign chain ID: ${chainId}`)
      throw new Error(`Unsupported campaign chain ID: ${chainId}`)
  }
}

function getRpcUrl(chainId: ChainId.BASE): string {
  const baseUrl = process.env.RPC_GATEWAY
  if (!baseUrl) {
    logger.error('RPC_GATEWAY is not set')
    throw new Error('RPC_GATEWAY is not set')
  }

  const networkName = {
    [ChainId.BASE]: 'base',
  }[chainId]

  if (!networkName) {
    throw new Error(`Unsupported campaign chain ID: ${chainId}`)
  }

  return `${baseUrl}?network=${networkName}`
}

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context,
): Promise<APIGatewayProxyResultV2> => {
  const SUBGRAPH_BASE = process.env.SUBGRAPH_BASE
  const RPC_GATEWAY = process.env.RPC_GATEWAY

  logger.addContext(context)

  if (!SUBGRAPH_BASE) {
    logger.error('SUBGRAPH_BASE is not set')
    return ResponseInternalServerError('SUBGRAPH_BASE is not set')
  }

  if (!RPC_GATEWAY) {
    logger.error('RPC_GATEWAY is not set')
    return ResponseInternalServerError('RPC_GATEWAY is not set')
  }

  const pathParamsResult = pathParamsSchema.safeParse(event.pathParameters || {})

  if (!pathParamsResult.success) {
    logger.error('Invalid path parameters', { errors: pathParamsResult.error.errors })
    return ResponseInternalServerError('Invalid path parameters')
  }

  const { campaign, questNumber, walletAddress } = pathParamsResult.data

  // Check if debug mode is enabled via query parameter or NODE_ENV
  const isDebugMode = typeof event.queryStringParameters?.debug !== 'undefined'

  try {
    logger.info(
      `Processing ${campaign} campaign request for quest ${questNumber}, wallet: ${walletAddress}`,
    )

    if (campaign === 'okx') {
      // Check if the wallet is an OKX campaign wallet
      const isOkxWallet = await isOkxCampaignWallet(walletAddress)
      if (!isOkxWallet) {
        logger.warn(`Wallet ${walletAddress} is not an OKX campaign wallet`)
        return ResponseOk({
          body: {
            code: 0,
            data: false,
            ...(isDebugMode && { debug: { walletAddress, isOkxWallet } }),
          },
        })
      }
      const client = createPublicClient({
        chain: getChainConfig(ChainId.BASE),
        transport: http(getRpcUrl(ChainId.BASE)),
      })
      const [okxQuestData, delegatesData] = await Promise.all([
        getCampaignData(
          { userAddress: walletAddress.toLowerCase(), campaign: 'okx' },
          { chainId: ChainId.BASE, urlBase: SUBGRAPH_BASE },
        ),
        client.readContract({
          abi: SummerTokenAbi,
          address: '0x194f360D130F2393a5E9F3117A6a1B78aBEa1624',
          functionName: 'delegates',
          args: [walletAddress],
        }),
      ])

      const questResults = checkOKXQuestsUpTo({
        questNumber,
        walletAddress,
        okxQuestData,
        delegatesData,
        logger,
      })
      const allCompleted = questResults.every((result) => result.completed)

      const response: CampaignResponse = {
        code: 0, // 0 indicates success, no other codes known at this time
        data: allCompleted,
        ...(isDebugMode && {
          debug: {
            walletAddress,
            questResults,
            allCompleted,
            okxQuestData,
            delegatesData,
          },
        }),
      }

      return ResponseOk({ body: response })
    }
    logger.error(`Unsupported campaign: ${campaign}`)
    return ResponseInternalServerError(`Unsupported campaign: ${campaign}`)
  } catch (error) {
    logger.error('Error processing campaign request', { error })
    return ResponseInternalServerError('Error processing campaign request')
  }
}

export default handler

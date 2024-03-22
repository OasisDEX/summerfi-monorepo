import { z } from 'zod'
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import {
  ResponseBadRequest,
  ResponseInternalServerError,
  ResponseOk,
} from '@summerfi/serverless-shared/responses'
import {
  addressSchema,
  bigIntSchema,
  chainIdSchema,
  urlOptionalSchema,
} from '@summerfi/serverless-shared/validators'

import { Logger } from '@aws-lambda-powertools/logger'
import { Address, ChainId } from '@summerfi/serverless-shared'
import { getMorphoBlueApiClient } from '@summerfi/morpho-blue-external-api-client'
import { getRewards, MorphoMarket, MorphoReward } from './get-rewards'
import BigNumber from 'bignumber.js'

const logger = new Logger({ serviceName: 'get-morpho-rewards-function' })

const tokenPriceSchema = z
  .number()
  .or(
    z
      .string()
      .refine((s) => !isNaN(Number(s)))
      .transform(Number),
  )
  .optional()
  .describe('Price of the token in USD to calculate the APY')

const paramsSchema = z
  .object({
    address: addressSchema,
    chainId: chainIdSchema.optional().default(ChainId.MAINNET),
    rpc: urlOptionalSchema,
    amount: bigIntSchema
      .optional()
      .describe('Amount of token accepted by Meta Morpho Vault in WEI. Default is 1000 TOKEN'),
    price_MORPHO: tokenPriceSchema,
    price_WSTETH: tokenPriceSchema,
    price_SWISE: tokenPriceSchema,
    price_USDC: tokenPriceSchema,
    morhoPrice: tokenPriceSchema,
    wsEthPrice: tokenPriceSchema,
    swisePrice: tokenPriceSchema,
    usdcPrice: tokenPriceSchema,
  })
  .transform((params) => {
    return {
      ...params,
      price_MORPHO: params.price_MORPHO ?? params.morhoPrice,
      price_WSTETH: params.price_WSTETH ?? params.wsEthPrice,
      price_SWISE: params.price_SWISE ?? params.swisePrice,
      price_USDC: params.price_USDC ?? params.usdcPrice,
    }
  })

export interface RewardToken {
  address: Address
  symbol: string
  decimals: number
  amountWei: bigint
  humanReadable: BigNumber
  apy: number
}

export interface RewardsByMarket {
  market: {
    marketId: `0x${string}`
    collateral: {
      address: Address
      symbol: string
      decimals: number
      priceUsd: number | undefined
    }
    quote: {
      address: Address
      symbol: string
      decimals: number
      priceUsd: number | undefined
    }
    liquidationLtv: number
    suppliedAssets: bigint
    suppliedAssetsHumanReadable: BigNumber
    allocation: number
  }
  tokens: RewardToken[]
}

const tokenOrder = ['Morpho', 'wstETH', 'SWISE', 'USDC']

export interface GetRewardsResponse {
  metaMorpho: {
    name: string
    address: Address
    weeklyApy: number
    monthlyApy: number
    dailyApy: number
    apy: number
    fee: number
    totalAssets: bigint
  }
  rewardsByMarket: RewardsByMarket[]
  rewardsByToken: RewardToken[]
}

const emptyResponse = (metaMorpho: Address): GetRewardsResponse => ({
  metaMorpho: {
    address: metaMorpho,
    weeklyApy: 0,
    monthlyApy: 0,
    dailyApy: 0,
    apy: 0,
    fee: 0,
    name: '',
    totalAssets: 0n,
  },
  rewardsByMarket: [],
  rewardsByToken: [],
})

const getPriceOfToken = (
  tokenSymbol: MorphoReward['token']['symbol'],
  params: z.infer<typeof paramsSchema>,
): number | undefined => {
  switch (tokenSymbol) {
    case 'Morpho':
      return params.price_MORPHO
    case 'wstETH':
      return params.price_WSTETH
    case 'SWISE':
      return params.price_SWISE
    case 'USDC':
      return params.price_USDC
    default:
      return undefined
  }
}

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

  logger.appendKeys({
    chainId: params.chainId,
  })

  const client = getMorphoBlueApiClient({ logger })

  const result = await client.allocations({ metaMorphoAddresses: [params.address] })
  if (result.length === 0) {
    return ResponseOk({ body: emptyResponse(params.address) })
  }

  // we can assume that the array should have only one element because we are querying only one address
  const allocations = result.flatMap((r) => r.allocations)
  const metaMorphoVault = result[0].vault
  if (metaMorphoVault.address !== params.address) {
    logger.error('Vault address does not match the requested address', { metaMorphoVault, params })
    return ResponseOk({ body: emptyResponse(params.address) })
  }
  const markets = allocations.map(
    (a): Pick<MorphoMarket, 'marketId'> => ({
      marketId: a.market.marketId as `0x${string}`,
    }),
  )

  const rewards = await getRewards({
    morphoMarkets: markets,
    customRpc: params.rpc,
    rpcGateway: RPC_GATEWAY,
    chainId: ChainId.MAINNET,
  })

  const depositedAmount = params.amount
    ? new BigNumber(params.amount.toString()).shiftedBy(-metaMorphoVault.asset.decimals)
    : new BigNumber(1000)

  const depositedAmountPrice = depositedAmount.times(metaMorphoVault.asset.priceUsd ?? 1)

  const rewardsByMarket: RewardsByMarket[] = allocations
    .map((a): RewardsByMarket | undefined => {
      const rewardMarket = rewards.result.find((r) => r.market.marketId === a.market.marketId)

      if (!rewardMarket) {
        logger.error(`No reward market found for market ${a.market.marketId}`)
        return undefined
      }

      const amountForMarket = depositedAmount.times(a.allocation)

      const tokens = rewardMarket.rewards
        .map((r): RewardToken => {
          const rewardsEmission = new BigNumber(r.supplyRewardTokensPerYear.toString())
          const tokenUsdValue = new BigNumber(a.market.loan.priceUsd ?? 1)
          const loanDecimals = new BigNumber(10).pow(a.market.loan.decimals)
          const totalUnderlyingAssets = new BigNumber(
            rewardMarket.market.totalSupplyAssets.toString(),
          )

          const userRewards = amountForMarket
            .times(rewardsEmission.div(tokenUsdValue))
            .times(loanDecimals.div(totalUnderlyingAssets))

          const rewardTokenPrice = getPriceOfToken(r.token.symbol, params)

          const humanReadable = userRewards.shiftedBy(-r.token.decimals)

          const apy = rewardTokenPrice
            ? humanReadable.times(rewardTokenPrice).div(depositedAmountPrice).toNumber()
            : 0

          return {
            address: r.token.address,
            symbol: r.token.symbol,
            decimals: r.token.decimals,
            amountWei: BigInt(userRewards.integerValue().toString()),
            humanReadable,
            apy: apy,
          }
        })
        .sort((a, b) => tokenOrder.indexOf(a.symbol) - tokenOrder.indexOf(b.symbol))

      return {
        market: {
          marketId: a.market.marketId,
          liquidationLtv: a.market.liquidationLtv,
          collateral: {
            address: a.market.collateral.address,
            symbol: a.market.collateral.symbol,
            decimals: a.market.collateral.decimals,
            priceUsd: a.market.collateral.priceUsd,
          },
          quote: {
            address: a.market.loan.address,
            symbol: a.market.loan.symbol,
            decimals: a.market.loan.decimals,
            priceUsd: a.market.loan.priceUsd,
          },
          suppliedAssetsHumanReadable: new BigNumber(a.suppliedAssets.toString()).shiftedBy(
            -a.market.loan.decimals,
          ),
          suppliedAssets: a.suppliedAssets,
          allocation: a.allocation,
        },
        tokens: tokens.filter((t) => t.amountWei > 0n),
      }
    })
    .filter((r): r is RewardsByMarket => r !== undefined)
    .filter((r) => r.tokens.length > 0)

  const rewardsByToken = rewardsByMarket
    .flatMap((r) => r.tokens)
    .reduce((acc, token) => {
      const existingToken = acc.find((t) => t.address === token.address)
      if (existingToken) {
        existingToken.amountWei += token.amountWei
        existingToken.humanReadable = existingToken.humanReadable.plus(token.humanReadable)
        existingToken.apy += token.apy
      } else {
        acc.push(token)
      }
      return acc
    }, [] as RewardToken[])
    .sort((a, b) => tokenOrder.indexOf(a.symbol) - tokenOrder.indexOf(b.symbol))

  const response: GetRewardsResponse = {
    metaMorpho: {
      name: metaMorphoVault.name,
      address: params.address,
      weeklyApy: metaMorphoVault.weeklyApy,
      monthlyApy: metaMorphoVault.monthlyApy,
      dailyApy: metaMorphoVault.dailyApy,
      apy: metaMorphoVault.apy,
      fee: metaMorphoVault.fee,
      totalAssets: metaMorphoVault.totalAssets,
    },
    rewardsByMarket,
    rewardsByToken,
  }

  return ResponseOk({ body: response })
}

export default handler

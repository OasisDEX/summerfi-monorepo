import { Address, ChainId, getRpcGatewayEndpoint, IRpcConfig } from '@summerfi/serverless-shared'
import { Chain as ViemChain, createPublicClient, http, PublicClient } from 'viem'
import { arbitrum, base, hyperliquid, mainnet, optimism, sepolia, sonic } from 'viem/chains'
import { morphoEmissionDataProviderAbi, morphoBlueAbi } from './abis'

import { AbiParametersToPrimitiveTypes, ExtractAbiFunction } from 'abitype'

type AddressName =
  | 'EmissionDataProvider'
  | 'MorphoOperator'
  | 'MorphoBlue'
  | 'URD_Morpho'
  | 'URD_wstETH'
  | 'URD_SWISE_StakeWise'
  | 'URD_USDC_EtherFi'
  | 'URD_USDC_Renzo'
  | 'wstETH'
  | 'SWISE'
  | 'Morpho'
  | 'USDC'

const addressesBook: Record<AddressName, Address> = {
  EmissionDataProvider: '0xf27fa85b6748c8a64d4b0D3D6083Eb26f18BDE8e',
  MorphoOperator: '0x640428D38189B11B844dAEBDBAAbbdfbd8aE0143',
  MorphoBlue: '0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb',
  URD_Morpho: '0x678dDC1d07eaa166521325394cDEb1E4c086DF43',
  URD_wstETH: '0x2EfD4625d0c149EbADf118EC5446c6de24d916A4',
  URD_SWISE_StakeWise: '0xfd9b178257ae397a674698834628262fd858aad3',
  URD_USDC_EtherFi: '0xB5b17231E2C89Ca34CE94B8CB895A9B124BB466e',
  URD_USDC_Renzo: '0x7815CAb40D9b83021f55418a013cceC3813646FB',
  wstETH: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
  SWISE: '0x48C3399719B582dD63eB5AADf12A40B4C3f52FA2',
  Morpho: '0x9994E35Db50125E0DF82e4c2dde62496CE330999',
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
}

type GetEmissionDataFunction = ExtractAbiFunction<
  typeof morphoEmissionDataProviderAbi,
  'rewardsEmissions'
>

type RewardsArgs = AbiParametersToPrimitiveTypes<GetEmissionDataFunction['inputs']>

export const rpcConfig: IRpcConfig = {
  skipCache: false,
  skipMulticall: false,
  skipGraph: true,
  stage: 'prod',
  source: 'summerfi-api',
}

const domainChainIdToViemChain: Record<ChainId, ViemChain> = {
  [ChainId.MAINNET]: mainnet,
  [ChainId.ARBITRUM]: arbitrum,
  [ChainId.OPTIMISM]: optimism,
  [ChainId.BASE]: base,
  [ChainId.SEPOLIA]: sepolia,
  [ChainId.SONIC]: sonic,
  [ChainId.HYPERLIQUID]: hyperliquid,
}

export interface GetRewardsParams {
  chainId: ChainId.MAINNET
  rpcGateway: string
  customRpc: string | undefined
  morphoMarkets: Pick<MorphoMarket, 'marketId'>[]
}

export interface MorphoMarket {
  marketId: `0x${string}`
  totalSupplyAssets: bigint
  totalSupplyShares: bigint
  totalBorrowAssets: bigint
  totalBorrowShares: bigint
}

export interface MorphoReward {
  token: {
    address: Address
    decimals: number
    symbol: 'Morpho' | 'wstETH' | 'SWISE' | 'USDC'
  }
  supplyRewardTokensPerYear: bigint
  borrowRewardTokensPerYear: bigint
  collateralRewardTokensPerYear: bigint
}

export interface MorphoRewards {
  result: {
    market: MorphoMarket
    rewards: MorphoReward[]
  }[]
}

export const getRewards = async ({
  morphoMarkets,
  chainId,
  rpcGateway,
  customRpc,
}: GetRewardsParams): Promise<MorphoRewards> => {
  const rpc = customRpc ?? getRpcGatewayEndpoint(rpcGateway, chainId, rpcConfig)
  const transport = http(rpc, {
    batch: true,
    fetchOptions: {
      method: 'POST',
    },
  })

  const viemChain: ViemChain = domainChainIdToViemChain[chainId]

  const publicClient: PublicClient = createPublicClient({
    transport,
    chain: viemChain,
  })

  const rewardsEmissionMulticallArgsPerMarket = morphoMarkets.map(
    (market): { market: Pick<MorphoMarket, 'marketId'>; args: RewardsArgs[] } => {
      return {
        market,
        args: [
          [
            addressesBook.MorphoOperator,
            addressesBook.URD_Morpho,
            addressesBook.Morpho,
            market.marketId,
          ],
          [
            addressesBook.MorphoOperator,
            addressesBook.URD_wstETH,
            addressesBook.wstETH,
            market.marketId,
          ],
          [
            addressesBook.MorphoOperator,
            addressesBook.URD_SWISE_StakeWise,
            addressesBook.SWISE,
            market.marketId,
          ],
          [
            addressesBook.MorphoOperator,
            addressesBook.URD_USDC_EtherFi,
            addressesBook.USDC,
            market.marketId,
          ],
          [
            addressesBook.MorphoOperator,
            addressesBook.URD_USDC_Renzo,
            addressesBook.USDC,
            market.marketId,
          ],
        ],
      }
    },
  )

  const result = await Promise.all(
    rewardsEmissionMulticallArgsPerMarket.map(
      async (
        args,
      ): Promise<{
        market: MorphoMarket
        rewards: MorphoReward[]
      }> => {
        const [morpho, wsteth, swise, usdcEtherFi, usdcRenzo] = await publicClient.multicall({
          contracts: args.args.map((args) => ({
            abi: morphoEmissionDataProviderAbi,
            address: addressesBook.EmissionDataProvider,
            functionName: 'rewardsEmissions',
            args: [...args],
          })),
          allowFailure: true,
        })

        const [totalSupplyAssets, totalSupplyShares, totalBorrowAssets, totalBorrowShares] =
          await publicClient.readContract({
            abi: morphoBlueAbi,
            address: addressesBook.MorphoBlue,
            functionName: 'market',
            args: [args.market.marketId],
          })

        const rewards: MorphoReward[] = []
        if (morpho.status === 'success') {
          rewards.push({
            token: {
              address: addressesBook.Morpho,
              decimals: 18,
              symbol: 'Morpho',
            },
            supplyRewardTokensPerYear: morpho.result[0],
            borrowRewardTokensPerYear: morpho.result[1],
            collateralRewardTokensPerYear: morpho.result[2],
          })
        }

        if (wsteth.status === 'success') {
          rewards.push({
            token: {
              address: addressesBook.wstETH,
              decimals: 18,
              symbol: 'wstETH',
            },
            supplyRewardTokensPerYear: wsteth.result[0],
            borrowRewardTokensPerYear: wsteth.result[1],
            collateralRewardTokensPerYear: wsteth.result[2],
          })
        }

        if (swise.status === 'success') {
          rewards.push({
            token: {
              address: addressesBook.SWISE,
              decimals: 18,
              symbol: 'SWISE',
            },
            supplyRewardTokensPerYear: swise.result[0],
            borrowRewardTokensPerYear: swise.result[1],
            collateralRewardTokensPerYear: swise.result[2],
          })
        }

        if (usdcEtherFi.status === 'success') {
          const reward: MorphoReward = {
            token: {
              address: addressesBook.USDC,
              decimals: 6,
              symbol: 'USDC',
            },
            supplyRewardTokensPerYear: usdcEtherFi.result[0],
            borrowRewardTokensPerYear: usdcEtherFi.result[1],
            collateralRewardTokensPerYear: usdcEtherFi.result[2],
          }

          if (usdcRenzo.status === 'success') {
            reward.supplyRewardTokensPerYear += usdcRenzo.result[0]
            reward.borrowRewardTokensPerYear += usdcRenzo.result[1]
            reward.collateralRewardTokensPerYear += usdcRenzo.result[2]
          }
          rewards.push(reward)
        }

        return {
          market: {
            ...args.market,
            totalSupplyAssets,
            totalSupplyShares,
            totalBorrowAssets,
            totalBorrowShares,
          },
          rewards,
        }
      },
    ),
  )

  return {
    result,
  }
}

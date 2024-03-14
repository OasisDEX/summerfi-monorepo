import {
  Address,
  ChainId,
  getRpcGatewayEndpoint,
  IRpcConfig,
  safeParseBigInt,
} from '@summerfi/serverless-shared'
import { Chain as ViemChain, createPublicClient, http, PublicClient } from 'viem'
import { arbitrum, base, mainnet, optimism, sepolia } from 'viem/chains'
import { universalRewardsDistributorAbi } from './abis'

type AddressName =
  | 'EmissionDataProvider'
  | 'MorphoOperator'
  | 'MorphoBlue'
  | 'URD_Morpho'
  | 'URD_wstETH'
  | 'URD_SWISE'
  | 'URD_USDC'
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
  URD_SWISE: '0xfd9b178257ae397a674698834628262fd858aad3',
  URD_USDC: '0xb5b17231e2c89ca34ce94b8cb895a9b124bb466e',
  wstETH: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
  SWISE: '0x48C3399719B582dD63eB5AADf12A40B4C3f52FA2',
  Morpho: '0x9994E35Db50125E0DF82e4c2dde62496CE330999',
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
}

type DistributionData = {
  urd: Address
  rewards: Address[]
  ipfs: string
}

type DistributionProvider =
  | 'LOL - Lido committee'
  | 'Morpho DAO'
  | 'StakeWise DAO'
  | 'Ether.fi'
  | 'Renzo Protocol'

const distributions: Record<DistributionProvider, DistributionData> = {
  'LOL - Lido committee': {
    urd: '0x2EfD4625d0c149EbADf118EC5446c6de24d916A4',
    ipfs: 'https://cloudflare-ipfs.com/ipfs/QmWoHV2tmhrmCBtc29SbW8b4VNyEBVXs3fUM9SXo9c3rDA',
    rewards: [addressesBook.wstETH],
  },
  'Morpho DAO': {
    urd: '0x678dDC1d07eaa166521325394cDEb1E4c086DF43',
    ipfs: 'https://cloudflare-ipfs.com/ipfs/QmZSCtDTbYe7pPiQKaKu1jLfZYzfeyRHXW3EgZTL4Qm73P',
    rewards: [addressesBook.Morpho],
  },
  'StakeWise DAO': {
    urd: '0xfD9B178257ae397a674698834628262fd858aaD3',
    ipfs: 'https://cloudflare-ipfs.com/ipfs/QmY4CQf55yj9MyHu5o2cTWdwQW1SUuzF1LD1fcoGLXgd4q',
    rewards: [addressesBook.SWISE],
  },
  'Ether.fi': {
    urd: '0xB5b17231E2C89Ca34CE94B8CB895A9B124BB466e',
    ipfs: 'https://cloudflare-ipfs.com/ipfs/QmWhQCrqh6KY6yEsfRk1iy5DSM5nVRtoC1CHdjhk76Mojt',
    rewards: [addressesBook.USDC],
  },
  'Renzo Protocol': {
    urd: '0x7815CAb40D9b83021f55418a013cceC3813646FB',
    ipfs: 'https://cloudflare-ipfs.com/ipfs/QmUWE32XD7LpW9Yd9dL6KXHHbLG3bptbHwrbMD9dYWo3RR',
    rewards: [addressesBook.USDC],
  },
}

type AccountAddress = Address
type Reward = Address
type Proof = Array<`0x${string}`>

type IpfsResponse = {
  metadata: {
    urd: Address
  }
  rewards: Record<AccountAddress, Record<Reward, { amount: string; proof: Proof }>>
}

// type GetEmissionDataFunction = ExtractAbiFunction<
//   typeof morphoEmissionDataProviderAbi,
//   'rewardsEmissions'
// >
//
// type RewardsArgs = AbiParametersToPrimitiveTypes<GetEmissionDataFunction['inputs']>

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
}

export interface GetClaimsParams {
  chainId: ChainId.MAINNET
  rpcGateway: string
  customRpc: string | undefined
  account: Address
}

export interface MorphoClaimedReward {
  urd: Address
  reward: Address
  rewardSymbol: string
  amount: bigint
}

export interface MorphoAggregatedClaims {
  rewardToken: {
    address: Address
    symbol: string
  }
  claimable: bigint
  claimed: bigint
  total: bigint
}

export interface MorphoClaims {
  claimable: {
    urd: Address
    reward: Address
    claimable: bigint
    proof: Proof
  }[]
  claimed: MorphoClaimedReward[]
  claimsAggregated: MorphoAggregatedClaims[]
}

export const getClaims = async ({
  account,
  chainId,
  rpcGateway,
  customRpc,
}: GetClaimsParams): Promise<MorphoClaims> => {
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

  const [morphoDAO_morpho, stateWise_Swise, lidoCommittee_wstETH, etherFi_usdc, renzo_usdc] =
    await publicClient.multicall({
      contracts: [
        {
          address: distributions['Morpho DAO'].urd,
          abi: universalRewardsDistributorAbi,
          functionName: 'claimed',
          args: [account, distributions['Morpho DAO'].rewards[0]],
        },
        {
          address: distributions['StakeWise DAO'].urd,
          abi: universalRewardsDistributorAbi,
          functionName: 'claimed',
          args: [account, distributions['StakeWise DAO'].rewards[0]],
        },
        {
          address: distributions['LOL - Lido committee'].urd,
          abi: universalRewardsDistributorAbi,
          functionName: 'claimed',
          args: [account, distributions['LOL - Lido committee'].rewards[0]],
        },
        {
          address: distributions['Ether.fi'].urd,
          abi: universalRewardsDistributorAbi,
          functionName: 'claimed',
          args: [account, distributions['Ether.fi'].rewards[0]],
        },
        {
          address: distributions['Renzo Protocol'].urd,
          abi: universalRewardsDistributorAbi,
          functionName: 'claimed',
          args: [account, distributions['Renzo Protocol'].rewards[0]],
        },
      ],
      allowFailure: true,
    })

  const ipfsResponses = await Promise.all(
    Object.values(distributions).map(async (data) => {
      const response = await fetch(data.ipfs)
      const parsed = (await response.json()) as IpfsResponse
      if (parsed.metadata.urd !== data.urd) {
        throw new Error('Invalid IPFS response')
      }
      const rewardsPerAccount = parsed.rewards[account]

      return Object.entries(rewardsPerAccount).map(([reward, rewardData]) => {
        const claimable = safeParseBigInt(rewardData.amount) ?? 0n
        const proof = rewardData.proof
        return { urd: data.urd, reward: reward as `0x${string}`, claimable, proof }
      })
    }),
  )

  const claimed: MorphoClaimedReward[] = []

  if (morphoDAO_morpho.status === 'success') {
    claimed.push({
      urd: distributions['Morpho DAO'].urd,
      reward: distributions['Morpho DAO'].rewards[0],
      rewardSymbol: 'Morpho',
      amount: morphoDAO_morpho.result,
    })
  }

  if (stateWise_Swise.status === 'success') {
    claimed.push({
      urd: distributions['StakeWise DAO'].urd,
      reward: distributions['StakeWise DAO'].rewards[0],
      rewardSymbol: 'SWISE',
      amount: stateWise_Swise.result,
    })
  }

  if (lidoCommittee_wstETH.status === 'success') {
    claimed.push({
      urd: distributions['LOL - Lido committee'].urd,
      reward: distributions['LOL - Lido committee'].rewards[0],
      rewardSymbol: 'wstETH',
      amount: lidoCommittee_wstETH.result,
    })
  }

  if (etherFi_usdc.status === 'success') {
    claimed.push({
      urd: distributions['Ether.fi'].urd,
      reward: distributions['Ether.fi'].rewards[0],
      rewardSymbol: 'USDC',
      amount: etherFi_usdc.result,
    })
  }

  if (renzo_usdc.status === 'success') {
    claimed.push({
      urd: distributions['Renzo Protocol'].urd,
      reward: distributions['Renzo Protocol'].rewards[0],
      rewardSymbol: 'USDC',
      amount: renzo_usdc.result,
    })
  }

  const claimable = ipfsResponses.flatMap((response) => response)

  const claimsAggregated: MorphoAggregatedClaims[] = claimed
    .map((claim) => {
      const claimableForReward = claimable
        .filter((c) => c.reward === claim.reward)
        .reduce((acc, c) => acc + c.claimable, 0n)
      const total = claim.amount + claimableForReward
      return {
        rewardToken: {
          address: claim.reward,
          symbol: claim.rewardSymbol,
        },
        claimable: claimableForReward,
        claimed: claim.amount,
        total: total,
      }
    })
    .reduce((acc, claim) => {
      const existing = acc.find((c) => c.rewardToken.address === claim.rewardToken.address)
      if (existing) {
        existing.claimable += claim.claimable
        existing.claimed += claim.claimed
        existing.total += claim.total
        return acc
      }
      return [...acc, claim]
    }, [] as MorphoAggregatedClaims[])

  return {
    claimable,
    claimed,
    claimsAggregated,
  }
}

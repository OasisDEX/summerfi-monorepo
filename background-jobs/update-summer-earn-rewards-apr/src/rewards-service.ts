import { Product } from "@summerfi/summer-earn-rates-subgraph"
import { Protocol } from "."
import { ChainId } from "@summerfi/serverless-shared"
import { Logger } from "@aws-lambda-powertools/logger"


const morphoTokenByChainId = {
  [ChainId.ARBITRUM]: '0x',
  [ChainId.OPTIMISM]: '0x',
  [ChainId.BASE]: '0xBAa5CC21fd487B8Fcc2F632f3F4E8D37262a0842',
  [ChainId.MAINNET]: '0x5956F3590814dC8f92Cf1D16d7D3B54e56Ec9090',
  [ChainId.SEPOLIA]: '0x',
}

export interface RewardRate {
  rewardToken: string
  rate: string
  token: {
    address: string
    symbol: string
    decimals: number
    precision: string
  }
}

interface EulerReward {
  startTimestamp: number
  endTimestamp: number
  apr: number
  rewardToken: {
    address: string
    symbol: string
    decimals: number
  }
}
interface MorphoVaultReward {
  id: string
  address: string
  symbol: string
  name: string
  chain: {
    id: string
  }
  creationBlockNumber: number
  state: {
    netApy: number
    netApyWithoutRewards: number
    rewards: {
      supplyApr: number
      asset: {
        address: string
        symbol: string
        decimals: number
      }
    }[]
  }
}
interface RetryConfig {
  maxRetries?: number
  initialDelay?: number
  backoffFactor?: number
}

export class RewardsService {
  private readonly MORPHO_API_URL = 'https://blue-api.morpho.org/graphql'
  private readonly EULER_API_URL = 'https://app.euler.finance/api/v1/rewards/merkl?chainId=' // TODO: Add actual Euler API URL
  private readonly DEFAULT_RETRY_CONFIG: RetryConfig = {
    maxRetries: 5,
    initialDelay: 2000, // 2 seconds
    backoffFactor: 2
  }
  private readonly logger: Logger
  constructor(logger: Logger) {
    this.logger = logger
  }
  async getRewardRates(products: Product[], chainId: ChainId): Promise<Record<string, RewardRate[]>> {
    this.logger.info(`[RewardsService] Getting reward rates for ${products.length} products on chain ${chainId}`);
    
    // Group products by protocol for batch processing
    const protocolGroups = products.reduce((acc: Record<Protocol, Product[]>, product) => {
      const protocol = product.protocol as Protocol; // Ensure product.protocol is of type Protocol
      acc[protocol] = acc[protocol] || [];
      acc[protocol].push(product);
      return acc;
    }, {} as Record<Protocol, Product[]>);

    const results: Record<string, RewardRate[]> = {};

    // Process Morpho products in batch
    if (protocolGroups[Protocol.Morpho]?.length) {
      const morphoResults = await this.getMorphoRewardsBatch(
        protocolGroups[Protocol.Morpho].map(p => p.id), 
        chainId
      );
      Object.assign(results, morphoResults);
    }

    // Process Euler products in batch
    if (protocolGroups[Protocol.Euler]?.length) {
      const eulerResults = await this.getEulerRewardsBatch(
        protocolGroups[Protocol.Euler].map(p => p.id), 
        chainId
      );
      Object.assign(results, eulerResults);
    }

    return results;
  }

  private async fetchWithRetry(url: string, options?: RequestInit, retryConfig?: RetryConfig): Promise<Response> {
    const config = { ...this.DEFAULT_RETRY_CONFIG, ...retryConfig }
    let attempt = 0

    while (attempt <= config.maxRetries!) {
      try {
        const response = await fetch(url, options)
        if (response.ok) return response
        throw new Error(`HTTP error! status: ${response.text}`)
      } catch (error) {
        attempt++
        if (attempt > config.maxRetries!) {
          console.error(`[RewardsService] Max retries (${config.maxRetries}) reached for ${url}`)
          throw error
        }
        console.log(error)
        const delay = config.initialDelay! * Math.pow(config.backoffFactor!, attempt - 1)
        console.warn(`[RewardsService] Attempt ${attempt} failed. Retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
    throw new Error('Unexpected error in fetchWithRetry')
  }

  private async getMorphoRewardsBatch(productIds: string[], chainId: ChainId): Promise<Record<string, RewardRate[]>> {
    this.logger.info(`[RewardsService] Getting Morpho rewards for ${productIds.length} products on chain ${chainId}`);
    
    const vaults = productIds.map(id => {
      const [, , vault] = id.split('-');
      return vault;
    });

    const uniqueVaults = [...new Set(vaults)];
    const query = `
      query GetVaultRewards($vaults: [String!]!, $chainId: Int!) {
        vaults(where: { address_in: $vaults, chainId_in: [$chainId] }) {
          items {
            id
            address
            symbol
            name
            chain {
              id
            }
            creationBlockNumber
            state {
              netApy
              netApyWithoutRewards
              rewards {
                supplyApr
                asset {
                  address
                  symbol
                  decimals
                }
              }
            }
          }
        }
      }
    `;

    try {
      const response = await this.fetchWithRetry(this.MORPHO_API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          query,
          variables: { vaults: uniqueVaults, chainId }
        })
      });

      const { data } = await response.json();
      const vaultItems: MorphoVaultReward[] = data?.vaults?.items || [];

      // Create a map for quick lookup
      const vaultMap = new Map(vaultItems.map(v => [v.address.toLowerCase(), v]));

      return productIds.reduce((acc, productId) => {
        const [, , vault] = productId.split('-');
        const vaultData = vaultMap.get(vault.toLowerCase());
        
        acc[productId] = vaultData ? this.processMorphoVault(vaultData, chainId) : [];
        return acc;
      }, {} as Record<string, RewardRate[]>);

    } catch (error) {
      console.error('[RewardsService] Error fetching Morpho rewards:', error);
      return Object.fromEntries(productIds.map(id => [id, []]));
    }
  }

  private processMorphoVault(vaultData: MorphoVaultReward, chainId: ChainId): RewardRate[] {
    const totalRewardsRate = (parseFloat(vaultData.state.netApy.toString()) - 
      parseFloat(vaultData.state.netApyWithoutRewards.toString())) * 100;

    const rewards = vaultData.state.rewards.map(reward => ({
      rewardToken: reward.asset.address,
      rate: (reward.supplyApr * 100).toString(),
      token: {
        address: reward.asset.address,
        symbol: reward.asset.symbol,
        decimals: reward.asset.decimals,
        precision: (10n ** BigInt(reward.asset.decimals)).toString()
      }
    }));

    const totalVaultRewardsRate = rewards.reduce((sum, reward) => sum + parseFloat(reward.rate), 0);
    const morphoTokenRewardRate = (totalRewardsRate - totalVaultRewardsRate);

    return [
      ...rewards,
      {
        rewardToken: morphoTokenByChainId[chainId],
        rate: morphoTokenRewardRate.toString(),
        token: {
          address: morphoTokenByChainId[chainId],
          symbol: 'Morpho',
          decimals: 18,
          precision: (10n ** BigInt(18)).toString()
        }
      }
    ];
  }

  private async getEulerRewardsBatch(productIds: string[], chainId: ChainId): Promise<Record<string, RewardRate[]>> {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    // const vaultAddresses = productIds.map(id => {
    //   const [, , vault] = id.split('-');
    //   return vault.toLowerCase();
    // });

    try {
      const response = await this.fetchWithRetry(`${this.EULER_API_URL}${chainId}`);
      const data = await response.json().then(originalData => 
        Object.fromEntries(
          Object.entries(originalData)
            .map(([key, value]) => [key.toLowerCase(), value])
        )
      ) as Record<string, EulerReward[]>;

      return productIds.reduce((acc, productId) => {
        const [, , vault] = productId.split('-');
        const rewards = data[vault.toLowerCase()] || [];
        
        acc[productId] = rewards
          .filter(reward => 
            reward.startTimestamp <= currentTimestamp &&
            reward.endTimestamp >= currentTimestamp
          )
          .map(reward => ({
            rewardToken: reward.rewardToken.address,
            rate: reward.apr.toString(),
            token: {
              address: reward.rewardToken.address,
              symbol: reward.rewardToken.symbol,
              decimals: reward.rewardToken.decimals,
              precision: (10n ** BigInt(reward.rewardToken.decimals)).toString()
            }
          }));

        return acc;
      }, {} as Record<string, RewardRate[]>);

    } catch (error) {
      console.error('[RewardsService] Error fetching Euler rewards:', error);
      return Object.fromEntries(productIds.map(id => [id, []]));
    }
  }
} 
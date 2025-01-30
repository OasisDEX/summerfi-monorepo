interface RewardRate {
  rewardToken: string
  rate: string
  token: {
    address: string
    symbol: string
    decimals: number
    precision: number
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

export class RewardsService {
  private readonly MORPHO_API_URL = 'https://blue-api.morpho.org/graphql'
  private readonly EULER_API_URL = 'https://app.euler.finance/api/v1/rewards/merkl?chainId=' // TODO: Add actual Euler API URL

  async getRewardRates(productId: string): Promise<RewardRate[]> {
    console.debug(`[RewardsService] getRewardRates called for productId: ${productId}`);
    if (productId.startsWith('Morpho')) {
      console.debug(`[RewardsService] Detected Morpho product`);
      return this.getMorphoRewards(productId)
    } else if (productId.startsWith('Euler')) {
      console.debug(`[RewardsService] Detected Euler product`);
      return this.getEulerRewards(productId)
    }
    console.debug(`[RewardsService] Unknown product type`);
    return []
  }

  private async getMorphoRewards(productId: string): Promise<RewardRate[]> {
    console.debug(`[RewardsService] getMorphoRewards called for productId: ${productId}`);
    const [, , vault, chainId] = productId.split('-')
    console.debug(`[RewardsService] Extracted vault: ${vault}, chainId: ${chainId}`);
    
    const query = `
      query GetVaultRewards($vault: String!, $chainId: Int!) {
        vaults(where: { address_in: [$vault], chainId_in: [$chainId] }) {
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
              apy
              netApy
            }
          }
        }
      }
    `

    try {
      console.debug(`[RewardsService] Making Morpho API request`);
      const response = await fetch(this.MORPHO_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: {
            vault,
            chainId: parseInt(chainId)
          }
        })
      })

      const { data } = await response.json()
      console.debug(`[RewardsService] Received Morpho API response`, data);
      const vaultData = data?.vaults?.items?.[0]

      if (!vaultData) {
        console.debug(`[RewardsService] No vault data found`);
        return []
      }

      // Convert netApy to rate string
      const rate = ((+vaultData.state.netApy - +vaultData.state.apy) * 100).toString()
      console.debug(`[RewardsService] Calculated rate: ${rate}`);

      return [{
        rewardToken: vaultData.address,
        rate,
        token: {
          address: vaultData.address,
          symbol: vaultData.symbol,
          decimals: 18, // Default for Morpho vaults
          precision: 18 // Default for Morpho vaults
        }
      }]
    } catch (error) {
      console.error('[RewardsService] Error fetching Morpho rewards:', error)
      return []
    }
  }

  private async getEulerRewards(productId: string): Promise<RewardRate[]> {
    console.debug(`[RewardsService] getEulerRewards called for productId: ${productId}`);
    const [, , vaultAddress, chainId] = productId.split('-')
    console.debug(`[RewardsService] Extracted vaultAddress: ${vaultAddress}, chainId: ${chainId}`);
    const currentTimestamp = Math.floor(Date.now() / 1000)
    console.debug(`[RewardsService] Current timestamp: ${currentTimestamp}`);

    try {
      console.debug(`[RewardsService] Making Euler API request to ${this.EULER_API_URL}${chainId}`);
      const response = await fetch(`${this.EULER_API_URL}${chainId}`)
      const data = (await response.json().then(originalData => {
        return Object.fromEntries(
          Object.entries(originalData).map(([key, value]) => [key.toLowerCase(), value])
        );
      })) as unknown as  Record<string, EulerReward[]>;
      const rewards = data[vaultAddress.toLowerCase()]

      if (!rewards) {
        console.debug(`[RewardsService] No rewards found for vault`);
        return []
      }

      const filteredRewards = rewards.filter((reward: EulerReward) => 
        reward.startTimestamp <= currentTimestamp && 
        reward.endTimestamp >= currentTimestamp
      )
      console.debug(`[RewardsService] Filtered rewards:`, filteredRewards);

      return filteredRewards.map((reward: EulerReward) => ({
        rewardToken: reward.rewardToken.address,
        rate: reward.apr.toString(),
        token: {
          address: reward.rewardToken.address,
          symbol: reward.rewardToken.symbol,
          decimals: reward.rewardToken.decimals,
          precision: reward.rewardToken.decimals
        }
      }))
    } catch (error) {
      console.error('[RewardsService] Error fetching Euler rewards:', error)
      return []
    }
  }
} 
import { type AddressValue, ChainIds } from '@summerfi/sdk-common'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'
import { type UsdcMerkleClaimable } from '@/features/portfolio/types'

// Merkl JSON_AIRDROP "Lazy Summer Ethereum USDC Claim" — mainnet USDC compensation airdrop
export const USDC_AIRDROP_CAMPAIGN_ID =
  '0xed07c79960f38e4189cdc6d031c35a66949c052866995205c54ccb954d5a9fe5'

export const getClaimableSUMRLVUSDCMerkleRewards = async (walletAddress: string) => {
  const [usdcToken] = await Promise.all([
    await backendSDK.tokens.getTokenBySymbol({
      symbol: 'USDC',
      chainId: ChainIds.Base,
    }),
  ])

  // these are fees rewards
  const claimableRewardsPerChain = await backendSDK.armada.users.getUserMerklRewards({
    address: walletAddress as AddressValue,
    chainIds: [ChainIds.Base],
    rewardsTokensAddresses: [
      usdcToken.address.value,
      // LVUSDC token, which is being rewarded in merkle as well
      '0x98C49e13bf99D7CAd8069faa2A370933EC9EcF17',
    ],
  })

  return claimableRewardsPerChain
}

export const getClaimableUsdcMerkleMerkleRewards = async (
  walletAddress: string,
): Promise<UsdcMerkleClaimable | null> => {
  const usdcToken = await backendSDK.tokens.getTokenBySymbol({
    symbol: 'USDC',
    chainId: ChainIds.Mainnet,
  })

  const claimableRewardsPerChain = await backendSDK.armada.users.getUserMerklRewards({
    address: walletAddress as AddressValue,
    merklChainId: ChainIds.Mainnet,
    rewardsTokensAddresses: [usdcToken.address.value],
  })

  const mainnetRewards = claimableRewardsPerChain.perChain[ChainIds.Mainnet] ?? []

  // The airdrop campaign is not in the SDK's campaignId->vault map, so its breakdown
  // surfaces in `unknownCampaigns` — that is where we detect campaign membership
  const airdropReward = mainnetRewards.find((reward) =>
    reward.unknownCampaigns.some((campaign) => campaign.campaignId === USDC_AIRDROP_CAMPAIGN_ID),
  )

  if (!airdropReward) {
    return null
  }

  // Merkl claim() is per-token cumulative, so the claimable amount is token-level
  // (amount - claimed) — for this wallet that is the airdrop plus any other USDC
  // merkle rewards on mainnet, which is exactly what the claim tx will transfer.
  // Right after campaign creation the whole amount sits in `pending` (no on-chain
  // merkle root yet, so no proofs and no claim possible) and moves to `amount`
  // once Merkl pushes the next root after the dispute period.
  const rawClaimable = Number(airdropReward.amount) - Number(airdropReward.claimed)
  const tokenUnit = 10 ** airdropReward.token.decimals
  const claimableNow = Math.max(rawClaimable / tokenUnit, 0)
  const pendingNow = Number(airdropReward.pending) / tokenUnit
  const tokenPrice = airdropReward.token.price || 1

  if (claimableNow <= 0 && pendingNow <= 0) {
    return null
  }

  return {
    claimableNow,
    pendingNow,
    usdValue: claimableNow * tokenPrice,
    pendingUsdValue: pendingNow * tokenPrice,
    tokenAddress: airdropReward.token.address,
  }
}

export const getClaimableWSTETHMerkleRewards = async (walletAddress: string) => {
  const [wstethToken] = await Promise.all([
    await backendSDK.tokens.getTokenBySymbol({
      symbol: 'WSTETH',
      chainId: ChainIds.Mainnet,
    }),
  ])

  // these are fees rewards
  const claimableRewardsPerChain = await backendSDK.armada.users.getUserMerklRewards({
    address: walletAddress as AddressValue,
    merklChainId: ChainIds.Mainnet,
    rewardsTokensAddresses: [wstethToken.address.value],
  })

  return claimableRewardsPerChain
}

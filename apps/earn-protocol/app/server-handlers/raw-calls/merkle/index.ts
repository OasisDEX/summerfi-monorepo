import { type AddressValue, ChainIds } from '@summerfi/sdk-common'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'

export const getClaimableMerkleRewards = async (walletAddress: string) => {
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

import { type AddressValue, ChainIds } from '@summerfi/sdk-common'

import { backendSDK } from '@/app/server-handlers/sdk/sdk-backend-client'

export const getClaimableMerkleRewards = async (walletAddress: string) => {
  const usdcToken = await backendSDK.tokens.getTokenBySymbol({
    symbol: 'USDC',
    chainId: ChainIds.Base,
  })

  // these are fees rewards
  const claimableRewardsPerChain = await backendSDK.armada.users.getUserMerklRewards({
    address: walletAddress as AddressValue,
    chainIds: [ChainIds.Base],
    rewardsTokensAddresses: [usdcToken.address.value],
  })

  return claimableRewardsPerChain
}

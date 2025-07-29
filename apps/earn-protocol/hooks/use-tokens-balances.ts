import { SupportedNetworkIds, SupportedSDKNetworks } from '@summerfi/app-types'
import BigNumber from 'bignumber.js'

import {
  arbitrumPublicClient,
  basePublicClient,
  mainnetPublicClient,
  sonicPublicClient,
} from '@/helpers/get-fe-public-client'
import { supportedNetworkGuard } from '@/helpers/supported-network-guard'
import { type TokenBalanceData, useTokenBalance } from '@/hooks/use-token-balance'
import { useUserWallet } from '@/hooks/use-user-wallet'

/**
 * Hook to fetch token and vault token balances for a specific network
 * @param {Object} params - The parameters object
 * @param {string} params.tokenSymbol - The symbol of the token to fetch balance for
 * @param {SupportedSDKNetworks} params.network - The network to fetch balances from (Arbitrum or Base)
 * @param {string} params.vaultTokenSymbol - The symbol of the vault token
 * @returns {Object} Object containing:
 *  - token: Token information
 *  - vaultToken: Vault token information
 *  - tokenBalance: Current balance as BigNumber
 *  - tokenBalanceLoading: Loading state boolean
 * @throws {Error} If an unsupported network is provided
 */
export const useTokenBalances = ({
  tokenSymbol,
  network,
  vaultTokenSymbol,
}: {
  tokenSymbol: string
  network: SupportedSDKNetworks
  vaultTokenSymbol: string
}): TokenBalanceData => {
  if (!supportedNetworkGuard(network)) {
    throw new Error(`Unsupported network: ${network}`)
  }
  const { userWalletAddress } = useUserWallet()

  const arbitrumTokenBalance = useTokenBalance({
    tokenSymbol,
    vaultTokenSymbol,
    publicClient: arbitrumPublicClient,
    chainId: SupportedNetworkIds.ArbitrumOne,
    skip: network !== SupportedSDKNetworks.ArbitrumOne,
  })
  const baseTokenBalance = useTokenBalance({
    tokenSymbol,
    vaultTokenSymbol,
    publicClient: basePublicClient,
    chainId: SupportedNetworkIds.Base,
    skip: network !== SupportedSDKNetworks.Base,
  })
  const mainnetTokenBalance = useTokenBalance({
    tokenSymbol,
    vaultTokenSymbol,
    publicClient: mainnetPublicClient,
    chainId: SupportedNetworkIds.Mainnet,
    skip: network !== SupportedSDKNetworks.Mainnet,
  })
  const sonicTokenBalance = useTokenBalance({
    tokenSymbol,
    vaultTokenSymbol,
    publicClient: sonicPublicClient,
    chainId: SupportedNetworkIds.SonicMainnet,
    skip: network !== SupportedSDKNetworks.SonicMainnet,
  })

  const balance = {
    [SupportedSDKNetworks.ArbitrumOne]: arbitrumTokenBalance,
    [SupportedSDKNetworks.Base]: baseTokenBalance,
    [SupportedSDKNetworks.Mainnet]: mainnetTokenBalance,
    [SupportedSDKNetworks.SonicMainnet]: sonicTokenBalance,
  }[network]

  /**
   * Returns zero balance for disconnected wallets while preserving token metadata
   */
  if (!userWalletAddress) {
    return {
      token: balance.token,
      vaultToken: balance.vaultToken,
      tokenBalance: new BigNumber(0),
      tokenBalanceLoading: false,
      handleSetTokenBalanceLoading: () => null,
    }
  }

  return balance
}

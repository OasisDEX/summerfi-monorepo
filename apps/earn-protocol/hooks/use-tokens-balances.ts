import { arbitrum, base, mainnet } from '@account-kit/infra'
import { SDKChainId, SDKNetwork } from '@summerfi/app-types'
import BigNumber from 'bignumber.js'
import { createPublicClient, http } from 'viem'
import { sonic } from 'viem/chains'

import { SDKChainIdToRpcGatewayMap } from '@/constants/networks-list'
import { supportedNetworkGuard } from '@/helpers/supported-network-guard'
import { useTokenBalance } from '@/hooks/use-token-balance'
import { useUserWallet } from '@/hooks/use-user-wallet'

/**
 * Public client instances for interacting with different networks
 */
const arbitrumPublicClient = createPublicClient({
  chain: arbitrum,
  transport: http(SDKChainIdToRpcGatewayMap[SDKChainId.ARBITRUM]),
})

const basePublicClient = createPublicClient({
  chain: base,
  transport: http(SDKChainIdToRpcGatewayMap[SDKChainId.BASE]),
})

const sonicPublicClient = createPublicClient({
  chain: sonic,
  transport: http(SDKChainIdToRpcGatewayMap[SDKChainId.SONIC]),
})

const mainnetPublicClient = createPublicClient({
  chain: mainnet,
  transport: http(SDKChainIdToRpcGatewayMap[SDKChainId.MAINNET]),
})

/**
 * Hook to fetch token and vault token balances for a specific network
 * @param {Object} params - The parameters object
 * @param {string} params.tokenSymbol - The symbol of the token to fetch balance for
 * @param {SDKNetwork} params.network - The network to fetch balances from (Arbitrum or Base)
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
  network: SDKNetwork
  vaultTokenSymbol: string
}) => {
  if (!supportedNetworkGuard(network)) {
    throw new Error(`Unsupported network: ${network}`)
  }
  const { userWalletAddress } = useUserWallet()

  const arbitrumTokenBalance = useTokenBalance({
    tokenSymbol,
    vaultTokenSymbol,
    publicClient: arbitrumPublicClient,
    chainId: SDKChainId.ARBITRUM,
    skip: network !== SDKNetwork.ArbitrumOne,
  })
  const baseTokenBalance = useTokenBalance({
    tokenSymbol,
    vaultTokenSymbol,
    publicClient: basePublicClient,
    chainId: SDKChainId.BASE,
    skip: network !== SDKNetwork.Base,
  })
  const mainnetTokenBalance = useTokenBalance({
    tokenSymbol,
    vaultTokenSymbol,
    publicClient: mainnetPublicClient,
    chainId: SDKChainId.MAINNET,
    skip: network !== SDKNetwork.Mainnet,
  })
  const sonicTokenBalance = useTokenBalance({
    tokenSymbol,
    vaultTokenSymbol,
    publicClient: sonicPublicClient,
    chainId: SDKChainId.SONIC,
    skip: network !== SDKNetwork.SonicMainnet,
  })

  const balance = {
    [SDKNetwork.ArbitrumOne]: arbitrumTokenBalance,
    [SDKNetwork.Base]: baseTokenBalance,
    [SDKNetwork.Mainnet]: mainnetTokenBalance,
    [SDKNetwork.SonicMainnet]: sonicTokenBalance,
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
    }
  }

  return balance
}

import { useMemo } from 'react'
import { arbitrum, base } from '@account-kit/infra'
import { useUser } from '@account-kit/react'
import { SDKChainId, SDKNetwork } from '@summerfi/app-types'
import BigNumber from 'bignumber.js'
import { createPublicClient, http } from 'viem'

import { SDKChainIdToRpcGatewayMap } from '@/constants/networks-list'
import { supportedNetworkGuard } from '@/helpers/supported-network-guard'
import { useTokenBalance } from '@/hooks/use-token-balance'

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
  const user = useUser()

  const arbitrumPublicClient = useMemo(() => {
    return createPublicClient({
      chain: arbitrum,
      transport: http(SDKChainIdToRpcGatewayMap[SDKChainId.ARBITRUM]),
    })
  }, [])

  const basePublicClient = useMemo(() => {
    return createPublicClient({
      chain: base,
      transport: http(SDKChainIdToRpcGatewayMap[SDKChainId.BASE]),
    })
  }, [])

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

  if (!user) {
    return {
      token: tokenSymbol,
      tokenBalance: new BigNumber(0),
      tokenBalanceLoading: false,
    }
  }

  return {
    [SDKNetwork.ArbitrumOne]: arbitrumTokenBalance,
    [SDKNetwork.Base]: baseTokenBalance,
  }[network]
}

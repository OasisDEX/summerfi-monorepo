import { alchemy, arbitrum, base, mainnet } from '@account-kit/infra'
import { type AlchemyAccountsUIConfig, cookieStorage, createConfig } from '@account-kit/react'
import { SDKChainId, SDKSupportedNetworkIdsEnum } from '@summerfi/app-types'
import { QueryClient } from '@tanstack/react-query'
import { type Chain } from 'viem'

export const queryClient = new QueryClient()

export type AccountKitSupportedNetworks = SDKChainId.BASE | SDKChainId.ARBITRUM | SDKChainId.MAINNET

export const SDKChainIdToAAChainMap = {
  [SDKChainId.ARBITRUM]: arbitrum,
  [SDKChainId.BASE]: base,
  [SDKChainId.MAINNET]: mainnet,
}

export const GasSponsorshipIdMap = {
  [SDKChainId.ARBITRUM]: undefined,
  [SDKChainId.BASE]: '7d552463-eba5-4eac-a940-56f0515243f2',
  [SDKChainId.MAINNET]: undefined,
}

const uiConfig: AlchemyAccountsUIConfig = {
  illustrationStyle: 'outline',
  auth: {
    sections: [
      [{ type: 'email' }],
      [
        { type: 'passkey' },
        { type: 'social', authProviderId: 'google', mode: 'popup' },
        { type: 'social', authProviderId: 'facebook', mode: 'popup' },
      ],
      [
        {
          type: 'external_wallets',
          walletConnect: { projectId: '832580820193ff6bae62a15dc0feff03' },
        },
      ],
    ],
    addPasskeyOnSignup: true,
  },
}

export const defaultChain = base

export const getAccountKitConfig = ({
  forkRpcUrl,
  chainId,
}: {
  forkRpcUrl?: string
  chainId?: SDKSupportedNetworkIdsEnum
}) => {
  return createConfig(
    {
      transport: alchemy({
        rpcUrl: forkRpcUrl ?? `/earn/api/rpc/chain/${chainId ?? defaultChain.id}`,
      }),
      signerConnection: {
        // this is for Alchemy Signer requests
        rpcUrl: '/earn/api/rpc',
      },
      chain: {
        [SDKSupportedNetworkIdsEnum.ARBITRUM]: arbitrum,
        [SDKSupportedNetworkIdsEnum.BASE]: base,
        [SDKSupportedNetworkIdsEnum.MAINNET]: mainnet,
      }[chainId ?? defaultChain.id] as Chain,
      chains: Object.values(SDKChainIdToAAChainMap).map((chain) => ({
        chain,
        policyId: GasSponsorshipIdMap[chain.id as SDKChainId.ARBITRUM | SDKChainId.BASE],
      })),
      ssr: true,
      storage: cookieStorage,
    },
    uiConfig,
  )
}

export const accountType = 'MultiOwnerModularAccount'

import { alchemy, arbitrum, base } from '@account-kit/infra'
import { type AlchemyAccountsUIConfig, cookieStorage, createConfig } from '@account-kit/react'
import { SDKChainId, SDKSupportedNetworkIdsEnum } from '@summerfi/app-types'
import { QueryClient } from '@tanstack/react-query'
import { type Chain } from 'viem'

export const queryClient = new QueryClient()

export const SDKChainIdToAAChainMap = {
  [SDKChainId.ARBITRUM]: arbitrum,
  [SDKChainId.BASE]: base,
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
      transport: alchemy({ rpcUrl: forkRpcUrl ?? `/api/rpc/chain/${chainId ?? defaultChain.id}` }),
      signerConnection: {
        // this is for Alchemy Signer requests
        rpcUrl: '/api/rpc',
      },
      chain: {
        [SDKSupportedNetworkIdsEnum.ARBITRUM]: arbitrum,
        [SDKSupportedNetworkIdsEnum.BASE]: base,
      }[chainId ?? defaultChain.id] as Chain,
      chains: Object.values(SDKChainIdToAAChainMap).map((chain) => ({
        chain,
      })),
      ssr: true,
      storage: cookieStorage,
    },
    uiConfig,
  )
}

export const accountType = 'MultiOwnerModularAccount'

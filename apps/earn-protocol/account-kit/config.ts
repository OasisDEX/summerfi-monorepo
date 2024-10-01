import { type AlchemyAccountsUIConfig, cookieStorage, createConfig } from '@account-kit/react'
import { base } from '@alchemy/aa-core'

import { NetworkIds } from '@/constants/networks-list'

type SupportedNetworkIds = NetworkIds.MAINNET | NetworkIds.BASEMAINNET

const uiConfig: AlchemyAccountsUIConfig = {
  illustrationStyle: 'outline',
  auth: {
    sections: [
      [{ type: 'email' as const }],
      [
        { type: 'passkey' as const },
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
  chainId?: SupportedNetworkIds
}) => {
  return createConfig(
    {
      rpcUrl: forkRpcUrl ?? `/api/rpc/chain/${chainId ?? defaultChain.id}`,
      signerConnection: {
        // this is for Alchemy Signer requests
        rpcUrl: '/api/rpc',
      },
      chain: {
        [NetworkIds.MAINNET]: defaultChain,
        [NetworkIds.BASEMAINNET]: base,
      }[chainId ?? (defaultChain.id as SupportedNetworkIds)],
      ssr: true,
      storage: cookieStorage,
    },
    uiConfig,
  )
}

export const accountType = 'MultiOwnerModularAccount'

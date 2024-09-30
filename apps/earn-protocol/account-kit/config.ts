import { type AlchemyAccountsUIConfig, cookieStorage, createConfig } from '@account-kit/react'
import { base } from '@alchemy/aa-core'

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

export const chain = base
export const config = createConfig(
  {
    rpcUrl: `/api/rpc/chain/${chain.id}`,
    signerConnection: {
      // this is for Alchemy Signer requests
      rpcUrl: '/api/rpc',
    },
    chain,
    ssr: true,
    storage: cookieStorage,
  },
  uiConfig,
)

export const accountType = 'MultiOwnerModularAccount'

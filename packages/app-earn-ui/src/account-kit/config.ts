import { alchemy, arbitrum, base, mainnet } from '@account-kit/infra'
import {
  type AlchemyAccountsConfigWithUI,
  type AlchemyAccountsUIConfig,
  cookieStorage,
  createConfig,
} from '@account-kit/react'
import { narval } from '@narval-xyz/connect/wagmi'
import { SupportedNetworkIds } from '@summerfi/app-types'
import { QueryClient } from '@tanstack/react-query'
import { type Chain } from 'viem'
import { sonic } from 'viem/chains'
import { safe } from 'wagmi/connectors'

export const queryClient: QueryClient = new QueryClient()

const connectors = [
  safe(),
  narval({
    config: {
      clientId: 'summerfi-earn-protocol-test',
    },
  }),
]

export const customAAKitSonicConfig: Chain = {
  ...sonic,
  rpcUrls: {
    ...sonic.rpcUrls,
    alchemy: sonic.rpcUrls.default,
  },
}

export const SDKChainIdToAAChainMap: {
  [key in SupportedNetworkIds]: Chain
} = {
  [SupportedNetworkIds.ArbitrumOne]: arbitrum,
  [SupportedNetworkIds.Base]: base,
  [SupportedNetworkIds.Mainnet]: mainnet,
  [SupportedNetworkIds.SonicMainnet]: customAAKitSonicConfig,
}

const GasSponsorshipIdMap = {
  [SupportedNetworkIds.Base]: '7d552463-eba5-4eac-a940-56f0515243f2',
  [SupportedNetworkIds.ArbitrumOne]: '99eeab13-6d37-4f9e-adf6-d59cd8060d7f',
  [SupportedNetworkIds.Mainnet]: undefined,
  [SupportedNetworkIds.SonicMainnet]: undefined,
}

const uiConfigDefault: AlchemyAccountsUIConfig = {
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

const uiConfigInstitutions: AlchemyAccountsUIConfig = {
  illustrationStyle: 'outline',
  uiMode: 'embedded',
  auth: {
    sections: [
      [
        {
          type: 'external_wallets',
          walletConnect: { projectId: '832580820193ff6bae62a15dc0feff03' },
        },
      ],
    ],
    hideSignInText: true,
    addPasskeyOnSignup: false,
  },
}

const defaultChain = base

export const getAccountKitConfig = ({
  forkRpcUrl,
  chainId,
  basePath,
  isInstitutions = false,
}: {
  forkRpcUrl?: string
  chainId?: SupportedNetworkIds
  basePath?: string
  isInstitutions?: boolean
}): AlchemyAccountsConfigWithUI => {
  const resolvedBasePath = basePath ?? ''

  return createConfig(
    {
      signerConnection: {
        // this is for Alchemy Signer requests
        rpcUrl: `${resolvedBasePath}/api/rpc`,
      },
      enablePopupOauth: true,
      connectors,
      chain: {
        [SupportedNetworkIds.ArbitrumOne]: arbitrum,
        [SupportedNetworkIds.Base]: base,
        [SupportedNetworkIds.Mainnet]: mainnet,
        [SupportedNetworkIds.SonicMainnet]: customAAKitSonicConfig,
      }[chainId ?? defaultChain.id] as Chain,
      chains: Object.values(SDKChainIdToAAChainMap).map((chain) => ({
        chain,
        policyId:
          GasSponsorshipIdMap[
            chain.id as SupportedNetworkIds.ArbitrumOne | SupportedNetworkIds.Base
          ],
        transport: alchemy({
          rpcUrl: forkRpcUrl ?? `${resolvedBasePath}/api/rpc/chain/${chain.id}`,
        }),
      })),
      ssr: true,
      storage: cookieStorage,
      sessionConfig: {
        expirationTimeMs: 1000 * 60 * 90, // 90 minutes,
      },
    },
    isInstitutions ? uiConfigInstitutions : uiConfigDefault,
  )
}

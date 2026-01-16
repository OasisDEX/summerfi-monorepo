import { alchemy, arbitrum, base, mainnet } from '@account-kit/infra'
import {
  type AlchemyAccountsConfigWithUI,
  type AlchemyAccountsUIConfig,
  cookieStorage,
  createConfig,
} from '@account-kit/react'
import { SupportedNetworkIds } from '@summerfi/app-types'
import { QueryClient } from '@tanstack/react-query'
import { type Chain } from 'viem'
import { entryPoint07Address } from 'viem/account-abstraction'
import { hyperliquid, sonic } from 'viem/chains'
import { safe } from 'wagmi/connectors'

export const queryClient: QueryClient = new QueryClient()

export const customAAKitSonicConfig: Chain = {
  ...sonic,
  rpcUrls: {
    ...sonic.rpcUrls,
    alchemy: {
      http: ['https://sonic-mainnet.g.alchemy.com/v2'],
    },
  },
}

export const customAAKitHyperliquidConfig: Chain = {
  ...hyperliquid,
  rpcUrls: {
    ...hyperliquid.rpcUrls,
    alchemy: {
      http: ['https://hyperliquid-mainnet.g.alchemy.com/v2'],
    },
  },
  contracts: {
    ...hyperliquid.contracts,
    entryPoint: {
      address: entryPoint07Address,
    },
  },
}

export const SDKChainIdToAAChainMap: {
  [key in SupportedNetworkIds]: Chain
} = {
  [SupportedNetworkIds.ArbitrumOne]: arbitrum,
  [SupportedNetworkIds.Base]: base,
  [SupportedNetworkIds.Mainnet]: mainnet,
  [SupportedNetworkIds.Hyperliquid]: customAAKitHyperliquidConfig,
  [SupportedNetworkIds.SonicMainnet]: customAAKitSonicConfig,
}

const GasSponsorshipIdMap = {
  [SupportedNetworkIds.Base]: '7d552463-eba5-4eac-a940-56f0515243f2',
  [SupportedNetworkIds.ArbitrumOne]: '99eeab13-6d37-4f9e-adf6-d59cd8060d7f',
  [SupportedNetworkIds.Mainnet]: undefined,
  [SupportedNetworkIds.SonicMainnet]: undefined,
  [SupportedNetworkIds.Hyperliquid]: undefined,
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
      connectors: [safe()],
      chain: {
        [SupportedNetworkIds.ArbitrumOne]: arbitrum,
        [SupportedNetworkIds.Base]: base,
        [SupportedNetworkIds.Mainnet]: mainnet,
        [SupportedNetworkIds.Hyperliquid]: customAAKitHyperliquidConfig,
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

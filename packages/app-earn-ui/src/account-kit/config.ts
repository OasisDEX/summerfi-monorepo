import { alchemy, arbitrum, base, mainnet } from '@account-kit/infra'
import {
  type AlchemyAccountsConfigWithUI,
  type AlchemyAccountsUIConfig,
  configForExternalWallets,
  cookieStorage,
  createConfig,
} from '@account-kit/react'
import { SupportedNetworkIds } from '@summerfi/app-types'
import { QueryClient } from '@tanstack/react-query'
import { type Chain } from 'viem'
import { entryPoint07Address } from 'viem/account-abstraction'
import { hyperliquid, sonic } from 'viem/chains'

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

// Keep external wallets settings in one place
export const externalWalletsConfig: ReturnType<typeof configForExternalWallets> =
  configForExternalWallets({
    wallets: ['injected', 'safe', 'wallet_connect', 'coinbase wallet'],
    chainType: ['evm'],
    walletConnectProjectId: '832580820193ff6bae62a15dc0feff03',
    hideMoreButton: false,
    numFeaturedWallets: 15,
    moreButtonText: 'More wallets',
  })

const uiConfigDefault: AlchemyAccountsUIConfig = {
  illustrationStyle: 'outline',
  uiMode: 'modal',
  auth: {
    sections: [
      [
        {
          type: 'external_wallets',
          ...externalWalletsConfig.uiConfig,
        },
      ],
    ],
    addPasskeyOnSignup: true,
    hideSignInText: false,
  },
}

const defaultChain = base

export const getAccountKitConfig = ({
  forkRpcUrl,
  chainId,
  basePath,
}: {
  forkRpcUrl?: string
  chainId?: SupportedNetworkIds
  basePath?: string
}): AlchemyAccountsConfigWithUI => {
  const resolvedBasePath = basePath ?? ''

  return createConfig(
    {
      signerConnection: {
        // this is for Alchemy Signer requests
        rpcUrl: `${resolvedBasePath}/api/rpc`,
      },
      enablePopupOauth: false,
      connectors: externalWalletsConfig.connectors,
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
    uiConfigDefault,
  )
}

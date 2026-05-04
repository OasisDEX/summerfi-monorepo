'use client'

import { type FC, type ReactNode, useRef } from 'react'
import { alchemy, arbitrum, base, mainnet } from '@account-kit/infra'
import {
  AlchemyAccountProvider,
  type AlchemyAccountsConfigWithUI,
  createConfig,
} from '@account-kit/react'
import { QueryClient } from '@tanstack/react-query'

// Dedicated QueryClient for Alchemy Account Kit.
// AlchemyAccountProvider wraps children with its own QueryClientProvider internally,
// so we must NOT add an outer QueryClientProvider here (it would shadow the Privy/Wagmi one).
const alchemyQueryClient = new QueryClient()

interface AlchemyMigrateProviderProps {
  children: ReactNode
  accountKitApiKey: string
}

export const AlchemyMigrateProvider: FC<AlchemyMigrateProviderProps> = ({
  children,
  accountKitApiKey,
}) => {
  // createConfig calls @wagmi/core's createConfig internally. We use a ref so it
  // is called exactly once per component instance (not on every render), which
  // prevents repeated wagmi config creation that would clobber @privy-io/wagmi state.
  const configRef = useRef<AlchemyAccountsConfigWithUI | null>(null)

  if (!configRef.current) {
    configRef.current = createConfig(
      {
        transport: alchemy({ apiKey: accountKitApiKey }),
        chain: mainnet,
        chains: [{ chain: mainnet }, { chain: base }, { chain: arbitrum }],
        ssr: false,
      },
      {
        illustrationStyle: 'linear',
        auth: {
          sections: [
            [{ type: 'email' }],
            [{ type: 'passkey' }, { type: 'social', authProviderId: 'google', mode: 'popup' }],
          ],
          addPasskeyOnSignup: false,
        },
      },
    )
  }

  return (
    <AlchemyAccountProvider config={configRef.current} queryClient={alchemyQueryClient}>
      {children}
    </AlchemyAccountProvider>
  )
}

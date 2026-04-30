'use client'

import { type FC, type ReactNode } from 'react'
import { alchemy, arbitrum, base, mainnet } from '@account-kit/infra'
import { AlchemyAccountProvider, createConfig } from '@account-kit/react'
import { QueryClient } from '@tanstack/react-query'

// Dedicated QueryClient for Alchemy Account Kit — intentionally separate from the
// app-wide one so it doesn't interfere with Privy/Wagmi state registered there.
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
  const config = createConfig(
    {
      transport: alchemy({ apiKey: accountKitApiKey }),
      chain: mainnet,
      chains: [
        {
          chain: base,
        },
        {
          chain: arbitrum,
        },
        {
          chain: mainnet,
        },
      ],
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

  return (
    <AlchemyAccountProvider config={config} queryClient={alchemyQueryClient}>
      {children}
    </AlchemyAccountProvider>
  )
}

import { type FC, type ReactNode } from 'react'
import { PrivyProvider } from '@privy-io/react-auth'
import { WagmiProvider } from '@privy-io/wagmi'
import { queryClient } from '@summerfi/app-earn-ui'
import { QueryClientProvider } from '@tanstack/react-query'

import { wagmiConfig } from '@/providers/WalletProvider/wagmi'

export const WalletProvider: FC<{
  children: ReactNode
}> = ({ children }) => {
  return (
    <PrivyProvider
      appId="cmmm608qu00c20cjy5p71zgqq"
      config={{
        loginMethods: ['wallet'],
        walletConnectCloudProjectId: '832580820193ff6bae62a15dc0feff03',
        appearance: {
          walletChainType: 'ethereum-only',
          showWalletLoginFirst: true,
          theme: 'dark',
          accentColor: '#ff49a4',
        },
        embeddedWallets: {
          disableAutomaticMigration: true,
          ethereum: {
            createOnLogin: 'off',
          },
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  )
}

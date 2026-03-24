import { type FC, type ReactNode } from 'react'
import { PrivyProvider } from '@privy-io/react-auth'
import { createConfig, WagmiProvider } from '@privy-io/wagmi'
import { queryClient, supportedViemChains } from '@summerfi/app-earn-ui'
import { QueryClientProvider } from '@tanstack/react-query'
import { type Chain } from 'viem'
import { http } from 'wagmi'

const supportedChains = Object.values(supportedViemChains) as [Chain, ...Chain[]]

const wagmiConfig = createConfig({
  chains: supportedChains,
  transports: supportedChains.reduce<{
    [key: number]: ReturnType<typeof http>
  }>((acc, chain) => {
    acc[chain.id] = http(`/earn/api/rpc/chain/${chain.id}`)

    return acc
  }, {}),
})

export const WalletProvider: FC<{
  children: ReactNode
}> = ({ children }) => {
  return (
    <PrivyProvider
      appId="cmmm608qu00c20cjy5p71zgqq"
      config={{
        loginMethods: ['wallet'],
        appearance: {
          walletChainType: 'ethereum-only',
          showWalletLoginFirst: true,
          theme: '#2b2b2b',
          accentColor: '#ff49a4',
          logo: 'https://summer.fi/img/branding/logo-dark.svg',
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
        <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  )
}

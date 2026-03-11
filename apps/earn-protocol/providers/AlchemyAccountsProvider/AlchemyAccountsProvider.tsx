'use client'
import { type FC, type PropsWithChildren, Suspense } from 'react'
import { PrivyProvider } from '@privy-io/react-auth'
import { createConfig as createPrivyWagmiConfig } from '@privy-io/wagmi'
import { queryClient, SDKChainIdToAAChainMap } from '@summerfi/app-earn-ui'
import { QueryClientProvider } from '@tanstack/react-query'
import { type Chain } from 'viem'
import { http, WagmiProvider } from 'wagmi'

const supportedChains = Object.values(SDKChainIdToAAChainMap) as [Chain, ...Chain[]]

const wagmiConfig = createPrivyWagmiConfig({
  chains: supportedChains,
  transports: supportedChains.reduce<{
    [key: number]: ReturnType<typeof http>
  }>((acc, chain) => {
    acc[chain.id] = http(`/earn/api/rpc/chain/${chain.id}`)

    return acc
  }, {}),
  ssr: true,
})

const AlchemyAccountsProvider: FC<
  PropsWithChildren<{
    initialState?: unknown
  }>
> = ({ children }) => {
  return (
    <Suspense>
      <PrivyProvider
        appId="cmmm608qu00c20cjy5p71zgqq"
        config={{
          loginMethods: ['wallet'],
          appearance: {
            showWalletLoginFirst: true,
          },
          embeddedWallets: {
            disableAutomaticMigration: true,
            ethereum: {
              createOnLogin: 'users-without-wallets',
            },
          },
        }}
      >
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
      </PrivyProvider>
    </Suspense>
  )
}

export default AlchemyAccountsProvider

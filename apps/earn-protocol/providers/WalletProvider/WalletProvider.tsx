import { type FC, type ReactNode } from 'react'
import { PrivyProvider } from '@privy-io/react-auth'
import { createConfig, WagmiProvider } from '@privy-io/wagmi'
import { queryClient, supportedViemChains } from '@summerfi/app-earn-ui'
import { QueryClientProvider } from '@tanstack/react-query'
import { type Chain } from 'viem'
import { http } from 'wagmi'
import { safe } from 'wagmi/connectors'

const supportedChains = Object.values(supportedViemChains) as [Chain, ...Chain[]]

const wagmiConfig = createConfig({
  connectors: [
    safe({
      allowedDomains: [/app\.safe\.global/u],
    }),
  ],
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
        walletConnectCloudProjectId: '832580820193ff6bae62a15dc0feff03',
        appearance: {
          walletChainType: 'ethereum-only',
          showWalletLoginFirst: true,
          theme: 'dark',
          accentColor: '#ff49a4',
          walletList: [
            'detected_ethereum_wallets',
            'metamask',
            'safe',
            'wallet_connect',
            'wallet_connect_qr',
          ],
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

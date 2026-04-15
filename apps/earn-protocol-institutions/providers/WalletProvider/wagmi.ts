import { createConfig } from '@privy-io/wagmi'
import { supportedViemChains } from '@summerfi/app-earn-ui'
import { type Chain } from 'viem'
import { http } from 'wagmi'
import { safe } from 'wagmi/connectors'

const supportedChains = Object.values(supportedViemChains) as [Chain, ...Chain[]]

export const wagmiConfig = createConfig({
  connectors: [
    safe({
      shimDisconnect: false,
    }),
  ],
  ssr: false,
  chains: supportedChains,
  transports: supportedChains.reduce<{
    [key: number]: ReturnType<typeof http>
  }>((acc, chain) => {
    acc[chain.id] = http(`/api/rpc/chain/${chain.id}`)

    return acc
  }, {}),
})

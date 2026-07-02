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
  // NOTE: do NOT set `ssr: false` here. Privy's createConfig defaults to `ssr: true`, and the main
  // earn-protocol app relies on that default. With `ssr: false`, wagmi's <Hydrate> calls its
  // `onMount()` on EVERY render (the once-on-mount path is SSR-only). Because Privy hardcodes
  // `reconnectOnMount: false`, each onMount wipes `config.state.connections` to an empty Map while
  // leaving status/current intact. A `router.refresh()` (useRevalidateTags) then re-renders the
  // tree, the useWalletClient query refetches against the wiped map and caches a
  // ConnectorNotConnectedError, breaking every subsequent transaction until a hard reload.
  chains: supportedChains,
  transports: supportedChains.reduce<{
    [key: number]: ReturnType<typeof http>
  }>((acc, chain) => {
    acc[chain.id] = http(`/api/rpc/chain/${chain.id}`)

    return acc
  }, {}),
})

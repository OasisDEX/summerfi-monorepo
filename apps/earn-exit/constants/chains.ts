import { defineChain } from 'viem'
import { arbitrum, base, mainnet, sonic } from 'viem/chains'

export const hyperliquid = defineChain({
  id: 999,
  name: 'HyperEVM',
  nativeCurrency: { name: 'HYPE', symbol: 'HYPE', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.hyperlend.finance'] },
  },
  blockExplorers: {
    default: {
      name: 'HyperEVMScan',
      url: 'https://hyperevmscan.io',
      apiUrl: 'https://api.hyperevmscan.io/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 13051,
    },
  },
})

export const SUPPORTED_CHAINS = [mainnet, base, arbitrum, sonic, hyperliquid] as const

export const SUPPORTED_CHAIN_IDS = SUPPORTED_CHAINS.map((chain) => chain.id)

// Hardcoded public RPC endpoints — the app requires no external env / NEXT_PUBLIC_ config.
// Each list is [primary, ...fallbacks]; consumers wire them into a viem `fallback` transport so a
// dead/slow endpoint automatically rolls over to the next. All URLs below were probed with an
// `eth_chainId` call and only those responding correctly in under a second are kept (endpoints that
// timed out or errored — e.g. eth.merkle.io, *.subquery.network, arbitrum.public.blockpi.network —
// were stripped).
export const RPC_URLS: { [chainId: number]: string[] } = {
  [mainnet.id]: [
    'https://ethereum-rpc.publicnode.com',
    'https://eth.drpc.org',
    'https://0xrpc.io/eth',
    'https://rpc.flashbots.net',
    'https://api.zan.top/eth-mainnet',
    'https://eth.meowrpc.com',
    'https://rpc.sentio.xyz/mainnet',
    'https://ethereum-json-rpc.stakely.io',
    'https://ethereum-public.nodies.app',
    'https://ethereum-mainnet.gateway.tatum.io',
  ],
  [base.id]: [
    'https://base-rpc.publicnode.com',
    'https://base.rpc.blxrbdn.com',
    'https://base-public.nodies.app',
    'https://base.lava.build',
    'https://base.drpc.org',
    'https://base.meowrpc.com',
    'https://base.api.pocket.network',
  ],
  [arbitrum.id]: [
    'https://arbitrum-one-rpc.publicnode.com',
    'https://arbitrum.drpc.org',
    'https://api.zan.top/arb-one',
    'https://arb-one-mainnet.gateway.tatum.io',
    'https://public-arb-mainnet.fastnode.io',
    'https://arbitrum-one-public.nodies.app',
    'https://arbitrum.meowrpc.com',
    'https://arbitrum-one.public.blastapi.io',
  ],
  [sonic.id]: [
    'https://sonic-rpc.publicnode.com',
    'https://rpc.soniclabs.com',
    'https://sonic.drpc.org',
    'https://sonic-mainnet.gateway.tatum.io',
    'https://sonic-json-rpc.stakely.io',
    'https://sonic.api.pocket.network',
    'https://sonic-mainnet.rpc.sentio.xyz',
  ],
  [hyperliquid.id]: [
    'https://rpc.hyperlend.finance',
    'https://hyperliquid.rpc.blxrbdn.com',
    'https://rpc.hypurrscan.io',
    'https://rpc.hyperliquid.xyz/evm',
    'https://hyperevm.rpc.sentio.xyz',
    'https://hyperliquid.drpc.org',
  ],
}

export const CHAIN_LABELS: { [chainId: number]: string } = {
  [mainnet.id]: 'Ethereum',
  [base.id]: 'Base',
  [arbitrum.id]: 'Arbitrum',
  [sonic.id]: 'Sonic',
  [hyperliquid.id]: 'Hyperliquid',
}

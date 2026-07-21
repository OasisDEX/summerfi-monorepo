'use client'

import { type ReactNode } from 'react'
import { queryClient } from '@summerfi/app-earn-ui'
import { QueryClientProvider } from '@tanstack/react-query'
import { fallback, http } from 'viem'
import { arbitrum, base, mainnet, sonic } from 'viem/chains'
import { createConfig, WagmiProvider } from 'wagmi'
import { injected, walletConnect } from 'wagmi/connectors'

import { hyperliquid, RPC_URLS, SUPPORTED_CHAINS } from '@/constants/chains'

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

export const wagmiConfig = createConfig({
  chains: SUPPORTED_CHAINS,
  connectors: [
    injected(),
    ...(walletConnectProjectId ? [walletConnect({ projectId: walletConnectProjectId })] : []),
  ],
  // Object.fromEntries loses the literal chain-id keys, so wagmi's Record<ChainId, Transport>
  // check fails — an explicit literal map keeps the exact runtime behaviour (same http()
  // transport per chain) while satisfying the type (see phase-2 doc fallback note).
  transports: {
    [mainnet.id]: fallback(RPC_URLS[mainnet.id].map((url) => http(url, { batch: true }))),
    [base.id]: fallback(RPC_URLS[base.id].map((url) => http(url, { batch: true }))),
    [arbitrum.id]: fallback(RPC_URLS[arbitrum.id].map((url) => http(url, { batch: true }))),
    [sonic.id]: fallback(RPC_URLS[sonic.id].map((url) => http(url, { batch: true }))),
    [hyperliquid.id]: fallback(RPC_URLS[hyperliquid.id].map((url) => http(url, { batch: true }))),
  },
})

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

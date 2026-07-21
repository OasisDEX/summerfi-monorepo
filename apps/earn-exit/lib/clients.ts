import { type Chain, createPublicClient, fallback, http, type PublicClient } from 'viem'

import { RPC_URLS, SUPPORTED_CHAINS } from '@/constants/chains'

const clients = new Map<number, PublicClient>()

export const getPublicClient = (chainId: number): PublicClient => {
  const cached = clients.get(chainId)

  if (cached) return cached

  const chain = SUPPORTED_CHAINS.find((candidate) => candidate.id === chainId)

  if (!chain) throw new Error(`Unsupported chainId ${chainId}`)

  // `chain` is narrowed to the union of the 5 SUPPORTED_CHAINS literal types, each with its own
  // formatter/serializer generics; that union makes createPublicClient's inferred return type
  // structurally diverge from the bare `PublicClient` annotation above (TS2719 "two different
  // types... unrelated"). Widening to the generic `Chain` type before the call collapses the
  // return type back to the default `PublicClient<Transport, Chain | undefined>` shape.
  const client = createPublicClient({
    chain: chain as Chain,
    // Primary endpoint first, remaining public RPCs as automatic failover.
    transport: fallback(RPC_URLS[chainId].map((url) => http(url, { batch: true }))),
    batch: { multicall: { wait: 50 } },
  })

  clients.set(chainId, client)

  return client
}

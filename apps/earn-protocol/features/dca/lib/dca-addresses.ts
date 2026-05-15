/**
 * Per-network configuration for the DCA flow.
 *
 * NOTE: this is a placeholder. The infra team owns:
 *  - The deployed DCA Router (a.k.a. AdmiralsQuarters) addresses per chain.
 *  - The on-chain Merkle root over allowed source/target vault pairs.
 *
 * Once those are finalised, this should be sourced from
 * `packages/deployment-configs` and exposed via a server handler that returns
 * `{ root, pairs: [{ from, to, proofFrom, proofTo }] }` per chain.
 */

import { type DCAAllowedPair } from './types'

/**
 * Placeholder DCA Router addresses per chain (numeric chainId → address).
 * Replace with addresses from `packages/deployment-configs` once available.
 */
export const DCA_ROUTER_ADDRESSES: { [key: number]: `0x${string}` } = {
  1: '0xabF2654d149E0fDcCb7e319796D065299376AFcC',
}

/**
 * Allowed source/target vault pairs. Filled in by infra once the on-chain
 * Merkle root is published. For now the wizard falls back to picking the
 * first available USDC vault as the source and the first available
 * WETH/ETH vault as the target on each network.
 */
export const DCA_ALLOWED_PAIRS: DCAAllowedPair[] = []

/**
 * Token symbols accepted as DCA sources / targets in the v1 UI.
 * Ordering matters – the first match wins when picking defaults.
 */
export const DCA_SOURCE_TOKEN_SYMBOLS = ['USDC', 'USDT'] as const
export const DCA_TARGET_TOKEN_SYMBOLS = ['WETH', 'ETH'] as const

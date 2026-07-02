import { z } from 'zod'
import { ChainIds, LegacyChainIds } from '../implementation/ChainIds'

/**
 * Represents the chain ID of a blockchain network
 */
export type ChainId = (typeof ChainIds)[keyof typeof ChainIds]

/**
 * Zod schema for ChainId
 */
// Create literals for each chain ID first
const chainIdLiterals = Object.values(ChainIds).map((chainId) => z.literal(chainId))

// Handle the case where we need at least two literals
/** Zod schema validating a value against the supported {@link ChainId} union. */
export const ChainIdSchema =
  chainIdLiterals.length >= 2
    ? z.union([chainIdLiterals[0], chainIdLiterals[1], ...chainIdLiterals.slice(2)])
    : (() => {
        throw Error('No chain IDs available')
      })()

/**
 * Type guard that checks whether a value is a supported {@link ChainId}.
 *
 * @param maybeChainId - The value to test.
 * @returns `true` if the value is a supported chain id.
 */
export const isChainId = (maybeChainId: unknown): maybeChainId is ChainId => {
  const zodReturn = ChainIdSchema.safeParse(maybeChainId)

  return zodReturn.success
}

/** Union of the legacy (pre-Armada) supported chain ids. */
export type LegacyChainId = (typeof LegacyChainIds)[keyof typeof LegacyChainIds]

const legacyChainIdLiterals = Object.values(LegacyChainIds).map((chainId) => z.literal(chainId))
/** Zod schema validating a value against the {@link LegacyChainId} union. */
export const LegacyChainIdSchema =
  legacyChainIdLiterals.length >= 2
    ? z.union([
        legacyChainIdLiterals[0],
        legacyChainIdLiterals[1],
        ...legacyChainIdLiterals.slice(2),
      ])
    : (() => {
        throw Error('No legacy chain IDs available')
      })()

/**
 * Type guard that checks whether a value is a {@link LegacyChainId}.
 *
 * @param maybeChainId - The value to test.
 * @returns `true` if the value is a legacy chain id.
 */
export const isLegacyChainId = (maybeChainId: unknown): maybeChainId is LegacyChainId => {
  const zodReturn = LegacyChainIdSchema.safeParse(maybeChainId)

  return zodReturn.success
}

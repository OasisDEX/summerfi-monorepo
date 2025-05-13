import { z } from 'zod'
import { ChainIds } from '../implementation/ChainIds'

/**
 * @name chainId
 * @description Represents the chain ID of a blockchain network
 */
export type ChainId = (typeof ChainIds)[keyof typeof ChainIds]

/**
 * @description Zod schema for ChainId
 */
// Create literals for each chain ID first
const chainIdLiterals = Object.values(ChainIds).map((chainId) => z.literal(chainId))

// Handle the case where we need at least two literals
export const ChainIdSchema =
  chainIdLiterals.length >= 2
    ? z.union([chainIdLiterals[0], chainIdLiterals[1], ...chainIdLiterals.slice(2)])
    : (() => {
        throw Error('No chain IDs available')
      })()

export const isChainId = (maybeChainId: unknown): maybeChainId is ChainId => {
  const zodReturn = ChainIdSchema.safeParse(maybeChainId)

  return zodReturn.success
}

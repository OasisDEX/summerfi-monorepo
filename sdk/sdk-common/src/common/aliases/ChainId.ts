import { z } from 'zod'

/**
 * @name chainId
 * @description Represents the chain ID of a blockchain network
 */
export type ChainId = number

/**
 * @description Zod schema for ChainId
 */
export const ChainIdSchema = z.number()

import { z } from 'zod'
import { getAddress } from 'viem'
import { isValidAddress, isValidMorphoBluePool } from './guards'
import { Address, ChainId, PoolId, ProtocolId } from './domain-types'
import { SUPPORTED_CHAIN_IDS, SUPPORTED_PROTOCOL_IDS } from './constants'
import { isBigInt } from './numbers-helpers'

export const addressSchema = z
  .custom<Address>((val: unknown) => {
    return isValidAddress(val)
  }, 'Invalid address format')
  .transform((a) => getAddress(a))

export const optionalPoolIdSchema = z.custom<PoolId>((val: unknown) => {
  if (!val) {
    // this is optional
    return true
  }
  return isValidMorphoBluePool(val)
}, 'Invalid pool ID format')

export const poolIdSchema = z.custom<PoolId>(isValidMorphoBluePool, 'Invalid pool ID format')

export const addressesSchema = z
  .string()
  .transform((val) => val.split(','))
  .refine((val) => {
    return val.every((address) => isValidAddress(address))
  })
  .transform((val) => val.map((a): Address => getAddress(a)))

export const bigIntSchema = z
  .string()
  .refine((value) => isBigInt(value), {
    params: {
      code: 'not-bigint',
    },
    message: 'Must be a BigInt without decimals',
  })
  .transform((value) => BigInt(value))
  .or(z.bigint())

export const chainIdSchema = z
  .nativeEnum(ChainId)
  .or(z.string().transform((val) => Number(val)))
  .refine((val) => {
    return z.nativeEnum(ChainId).safeParse(val).success
  })
  .transform((val) => {
    return z.nativeEnum(ChainId).parse(val)
  })

export const chainIdsSchema = z
  .string()
  .transform((val) => val.split(',').map(Number))
  .transform((val) => {
    return z.nativeEnum(ChainId).array().parse(val)
  })
  .refine(
    (val) => {
      return val.every((protocolId) => SUPPORTED_CHAIN_IDS.includes(protocolId))
    },
    { message: 'Unsupported chain id' },
  )

export const protocolIdsSchema = z
  .string()
  .transform((val) => val.split(','))
  .transform((val) => {
    return z.nativeEnum(ProtocolId).array().parse(val)
  })
  .refine(
    (val) => {
      // foreach val in val, check if it is a valid protocol id
      return val.every((protocolId) => SUPPORTED_PROTOCOL_IDS.includes(protocolId))
    },
    { message: 'Unsupported protocol id' },
  )

export const protocolIdSchema = z
  .nativeEnum(ProtocolId)
  .or(z.string())
  .refine((val) => z.nativeEnum(ProtocolId).safeParse(val).success)
  .transform((val) => z.nativeEnum(ProtocolId).parse(val))

export const urlOptionalSchema = z.string().url().optional()

export const ltvSchema = bigIntSchema.refine((ltv) => ltv >= 0n && ltv < 10_000n, {
  params: {
    code: 'ltv-out-of-range',
  },
  message: 'LTV must be between 0 and 10_000',
})

export const percentageSchema = bigIntSchema.refine(
  (percentage) => percentage >= 0n && percentage <= 10_000n,
  {
    params: {
      code: 'percentage-out-of-range',
    },
    message: 'Percentage must be between 0 and 100_000',
  },
)

export type LTV = z.infer<typeof ltvSchema>
export type Percentage = z.infer<typeof percentageSchema>

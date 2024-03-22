import { z } from 'zod'
import { getAddress } from 'viem'
import { isValidAddress } from './guards'
import { Address, ChainId, ProtocolId } from './domain-types'
import { SUPPORTED_CHAIN_IDS, SUPPORTED_PROTOCOL_IDS } from './constants'
import { isBigInt } from './numbers-helpers'

export const addressSchema = z
  .custom<Address>((val: unknown) => {
    return isValidAddress(val)
  }, 'Invalid address format')
  .transform((a) => getAddress(a))

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

export const urlOptionalSchema = z.string().url().optional()

import { getShortDate } from './helpers'
import {
  addressesSchema,
  addressSchema,
  chainIdSchema,
  ltvSchema,
  protocolIdSchema,
} from '@summerfi/serverless-shared'
import { CalculateRates } from './protocols/types'
import { z } from 'zod'

export enum PositionMode {
  Supply = 'supply',
  Borrow = 'borrow',
}

export const positionModeSchema = z
  .nativeEnum(PositionMode)
  .or(z.string())
  .refine((val) => z.nativeEnum(PositionMode).safeParse(val).success)
  .transform((val) => z.nativeEnum(PositionMode).parse(val))

export const referenceDateSchema = z
  .date()
  .or(z.string().transform((val) => new Date(val)))
  .refine((val) => {
    return !isNaN(val.getTime())
  })
  .transform((date) => {
    return getShortDate(date)
  })

export const aaveLikePositionSchema = z.object({
  collateral: addressesSchema,
  debt: addressesSchema,
  ltv: ltvSchema,
  referenceDate: referenceDateSchema,
})

export const morphoBluePositionSchema = z.object({
  ltv: ltvSchema,
  marketId: z.custom<`0x${string}`>((val) => {
    if (typeof val !== 'string') {
      return false
    }
    const splitted = val.split('0x')
    if (splitted.length !== 2) {
      return false
    }
    const [, bytes] = splitted
    return bytes.length == 64
  }),
  mode: positionModeSchema,
  referenceDate: referenceDateSchema,
})

export const ajnaPositionSchema = z.object({
  ltv: ltvSchema,
  poolAddress: addressSchema,
  mode: positionModeSchema,
  referenceDate: referenceDateSchema,
})

export const pathParamsSchema = z.object({
  chainId: chainIdSchema,
  protocol: protocolIdSchema,
})

export type AaveLikePosition = z.infer<typeof aaveLikePositionSchema>
export type MorphoBluePosition = z.infer<typeof morphoBluePositionSchema>
export type AjnaPosition = z.infer<typeof ajnaPositionSchema>

export type ApyResult = CalculateRates & { apy: number }

export interface ApyResponse {
  position: AaveLikePosition | MorphoBluePosition | AjnaPosition
  multiply: number
  positionData: unknown
  results: ApyResult
}

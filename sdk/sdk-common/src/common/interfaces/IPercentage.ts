import { z } from 'zod'

/**
 * @name IPercentage
 * @description Percentage type that can be used for calculations with other types like TokenAmount or Price
 */
export interface IPercentage {
  /** The percentage in floating point format */
  value: number
}

/**
 * @description Type guard for IPercentage
 * @param maybePercentage
 * @returns true if the object is an IPercentage
 */
export function isPercentage(maybePercentage: unknown): maybePercentage is IPercentage {
  return (
    typeof maybePercentage === 'object' && maybePercentage !== null && 'value' in maybePercentage
  )
}

/**
 * @description Zod schema for IPercentage
 */
export const PercentageSchema = z.object({
  value: z.number(),
})

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IPercentage = {} as z.infer<typeof PercentageSchema>

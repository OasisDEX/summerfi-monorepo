import { z } from 'zod'

/**
 * @name IPercentageData
 * @description Percentage type that can be used for calculations with other types like TokenAmount or Price
 */
export interface IPercentageData {
  /** The percentage in floating point format */
  value: number
}

/**
 * @name IPercentage
 * @description Interface for the implementors of the percentage
 *
 * This interface is used to add all the methods that the interface supports
 */
export interface IPercentage extends IPercentageData {
  readonly value: number

  /**
   * @name add
   * @param percentage Percentage to add
   * @returns the result of the addition
   */
  add(percentage: IPercentage): IPercentage

  /**
   * @name subtract
   * @param percentage Percentage to subtract
   * @returns the result of the subtraction
   */
  subtract(percentage: IPercentageData): IPercentage

  /**
   * @name toProportion
   * @returns Returns the equivalent proportion of the percentage
   *
   * The proportion is the percentage divided by 100, this is, a floating value between 0 and 1
   */
  toProportion(): number
}

/**
 * @description Zod schema for IPercentage
 */
export const PercentageSchema = z.object({
  value: z.number(),
})

/**
 * @description Type guard for IPercentage
 * @param maybePercentage
 * @returns true if the object is an IPercentage
 */
export function isPercentage(maybePercentage: unknown): maybePercentage is IPercentageData {
  return PercentageSchema.safeParse(maybePercentage).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: IPercentageData = {} as z.infer<typeof PercentageSchema>

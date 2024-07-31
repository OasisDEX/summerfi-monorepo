import { z } from 'zod'
import { IPrintable } from './IPrintable'

/**
 * Unique signature for the interface so it can be differentiated from other similar interfaces
 */
export const __signature__: unique symbol = Symbol()

/**
 * @name IPercentage
 * @description Percentage type that can be used for calculations with other types like TokenAmount or Price
 */
export interface IPercentage extends IPercentageData, IPrintable {
  /** Signature to differentiate from similar interfaces */
  readonly [__signature__]: symbol
  /** The percentage in floating point format */
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
   * @name multiply
   * @param multiplier A percentage, string amount or number to multiply
   * @returns The resulting percentage
   */
  multiply(multiplier: string | number | IPercentage): IPercentage

  /**
   * @name divide
   * @param divisor A percentage, string amount or number to divide
   * @returns The resulting percentage
   */
  divide(divisor: string | number | IPercentage): IPercentage

  /**
   * @name toProportion
   * @returns Returns the equivalent proportion of the percentage
   *
   * The proportion is the percentage divided by 100, this is, a floating value between 0 and 1
   */
  toProportion(): number

  /**
   * @name toComplement
   * @returns The complement of the percentage
   *
   * The complement is the difference between 100% and the percentage
   */
  toComplement(): IPercentage

  /**
   * @name toBaseUnit
   * @param decimals The number of decimals to use for the conversion
   * @returns The percentage as a string in base unit
   */
  toBaseUnit(params: { decimals: number }): string
}

/**
 * @description Zod schema for IPercentage
 */
export const PercentageDataSchema = z.object({
  value: z.number(),
})

/**
 * Type for the data part of the IPercentage interface
 */
export type IPercentageData = Readonly<z.infer<typeof PercentageDataSchema>>

/**
 * Type for the parameters of the IPercentage interface
 */
export type IPercentageParameters = Omit<IPercentageData, ''>

/**
 * @description Type guard for IPercentage
 * @param maybePercentage
 * @returns true if the object is an IPercentage
 */
export function isPercentage(maybePercentage: unknown): maybePercentage is IPercentage {
  return isPercentageData(maybePercentage)
}

/**
 * @description Type guard for IPercentageData
 * @param maybePercentageData
 * @returns true if the object is an IPercentageData
 */
export function isPercentageData(
  maybePercentageData: unknown,
): maybePercentageData is IPercentageData {
  return PercentageDataSchema.safeParse(maybePercentageData).success
}

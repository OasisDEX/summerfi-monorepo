import { Printable } from './Printable'

/**
 * @name PercentageType
 * @description Represents the type of a percentage
 */
export enum PercentageType {
  /** The percentage is a proportion, this is a number between 0 and 1 */
  Proportion = 'Proportion',
  /** The percentage is an absolute value, this is a number between 0 and 100 */
  Percentage = 'Percentage',
}

/**
 * @interface Percentage
 * @description Represents a percentage
 */
export interface Percentage extends Printable {
  value: number
  type: PercentageType
}

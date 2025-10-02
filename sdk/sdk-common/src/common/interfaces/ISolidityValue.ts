/**
 * @interface ISolidityValue
 * @description Interface for data types that can be transformed into a custom Solidity value
 */
export interface ISolidityValue<T> {
  /**
   * Converts the instance into a Solidity value
   */
  toSolidityValue(): T
}

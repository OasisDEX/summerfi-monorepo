import { BigNumber } from 'bignumber.js'

/**
 * @interface IValueConverter
 * @description Interface for data types that can be transformed into a Solidity value or a BigNumber
 *
 * The intention is to standardize the way that SDK common types are converted into Solidity values or BigNumbers
 */
export interface IValueConverter {
  /**
   * Converts the instance into a Solidity value
   *
   * @param decimals The number of decimals used to represent the value in Solidity
   *
   * @returns The value as a TypeScript bigint that can be passed to a Solidity contract
   *
   * @remarks The value is expected to be scaled by 10^decimals, thus yielding a Solidity uint256
   *          value with the correct fixed point decimals
   *
   * @remarks The data type implementing this interface should provide a default value for decimals
   *          when possible to aid in the conversion
   */
  toSolidityValue(params?: { decimals: number }): bigint

  /**
   * Converts the instance into a BigNumber
   *
   * @returns The value as a BigNumber
   *
   * @remarks It returns a BigNumber without explicit decimals. This function is intended for low
   *          level operations not accounted for in the specific data type. The BigNumber does NOT
   *          carry any information on how many decimals the value has, meaning that the conversion
   *          of BigNumber to a Solidity value must be done manually
   *
   * @remarks Use `toSolidityValue` to convert the value to a Solidity value instead
   */
  toBigNumber(): BigNumber
}

import BigNumber from 'bignumber.js'

/**
 * Converts a given value to a `BigNumber` instance.
 *
 * This function takes a `BigNumber`, `string`, or `number` or `bigint` input and ensures the output is always a `BigNumber`.
 * If the input is already a `BigNumber`, it returns the input as-is; otherwise, it initializes a new `BigNumber`
 * with the provided value.
 *
 * @param value - The value to convert to `BigNumber`. Can be a `BigNumber`, `string`, or `number`.
 *
 * @returns A `BigNumber` instance representing the input value.
 *
 * @example
 * formatToBigNumber("123.45"); // Returns a BigNumber initialized with "123.45"
 * formatToBigNumber(123.45); // Returns a BigNumber initialized with 123.45
 * formatToBigNumber(new BigNumber(123.45)); // Returns the input BigNumber as-is
 */

export const formatToBigNumber = (value: BigNumber | string | number | bigint): BigNumber =>
  typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint'
    ? new BigNumber(value.toString())
    : value

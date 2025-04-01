import BigNumber from 'bignumber.js'

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

/**
 * Sorts two values of compatible types (numbers, strings, or BigInts) based on a specified direction.
 *
 * This function allows sorting of values that are either numbers, numeric strings, or BigInts. If
 * both values are numeric strings, they are compared as numbers. If values are strings but not numeric,
 * they are compared lexicographically.
 *
 * @param a - The first value to compare, which can be of type `bigint`, `number`, or `string`.
 * @param b - The second value to compare, compatible with the type of `a`.
 * @param direction - The desired sort direction, either `SortDirection.ASC` for ascending or `SortDirection.DESC` for descending.
 * @returns `1` if `a` is greater than `b`, `-1` if `a` is less than `b`, or `0` if they are equal, modified by the specified direction.
 *
 * @throws {Error} If the values are of incompatible types for sorting.
 *
 * @example
 * const result = simpleSort({ a: 3, b: 10, direction: SortDirection.ASC });
 * console.log(result); // -1
 */
export const simpleSort = ({
  a,
  b,
  direction,
}: {
  direction: SortDirection
  a: bigint | string | number
  b: bigint | string | number
}): number => {
  let result: number

  const isNumericString = (value: string) => !isNaN(Number(value))

  if (typeof a === 'bigint' && typeof b === 'bigint') {
    result = a > b ? 1 : a < b ? -1 : 0
  } else if (typeof a === 'number' && typeof b === 'number') {
    result = a > b ? 1 : a < b ? -1 : 0
  } else if (BigNumber.isBigNumber(a) && BigNumber.isBigNumber(b)) {
    result = a.gt(b) ? 1 : a.lt(b) ? -1 : 0
  } else if (typeof a === 'string' && typeof b === 'string') {
    if (isNumericString(a) && isNumericString(b)) {
      // Compare as numbers if both are numeric strings
      const numA = Number(a)
      const numB = Number(b)

      result = numA > numB ? 1 : numA < numB ? -1 : 0
    } else {
      // Compare as regular strings if not numeric
      result = a.localeCompare(b)
    }
  } else {
    throw new Error('Incompatible types for sorting')
  }

  // Adjust for sort direction
  return direction === SortDirection.ASC ? result : -result
}

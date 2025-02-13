/**
 * Calculates the median of a list of numbers.
 *
 * @param values - An array of numbers to calculate the median from.
 * @returns The median value, or 0 if no non-zero values exist.
 *
 * @example
 * const median = getMedian([3, 0, 4, 2, 0]);
 * console.log(median); // Output: 3
 *
 * @remarks
 * - Filters out zero values before calculation
 * - If the array has an odd number of elements, the function returns the middle element.
 * - If the array has an even number of elements, it returns the average of the two middle elements.
 * - The function mutates the filtered array by sorting it.
 */
export const getMedian = (values: number[]): number => {
  // Filter out zeros and create a new array
  const nonZeroValues = values.filter((value) => value !== 0)

  // Return 0 if no non-zero values exist
  if (nonZeroValues.length === 0) {
    return 0
  }

  // Sort the array in ascending order
  nonZeroValues.sort((a, b) => a - b)

  const mid = Math.floor(nonZeroValues.length / 2)

  // If the array has an odd length, return the middle element
  if (nonZeroValues.length % 2 !== 0) {
    return nonZeroValues[mid]
  }

  // If the array has an even length, return the average of the two middle elements
  return (nonZeroValues[mid - 1] + nonZeroValues[mid]) / 2
}

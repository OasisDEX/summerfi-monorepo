/**
 * Calculates the median of a list of numbers.
 *
 * @param values - An array of numbers to calculate the median from.
 * @returns The median value.
 *
 * @example
 * const median = getMedian([3, 1, 4, 2]);
 * console.log(median); // Output: 2.5
 *
 * @remarks
 * - If the array has an odd number of elements, the function returns the middle element.
 * - If the array has an even number of elements, it returns the average of the two middle elements.
 * - The function mutates the original array by sorting it. To avoid this, clone the array before passing.
 */
export const getMedian = (values: number[]): number => {
  // Sort the array in ascending order
  values.sort((a, b) => a - b)

  const mid = Math.floor(values.length / 2)

  // If the array has an odd length, return the middle element
  if (values.length % 2 !== 0) {
    return values[mid]
  }

  // If the array has an even length, return the average of the two middle elements
  return (values[mid - 1] + values[mid]) / 2
}

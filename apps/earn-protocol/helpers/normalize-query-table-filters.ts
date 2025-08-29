/**
 * Normalizes an array of strings by sorting and joining them with commas.
 *
 * @param {string[]} arr - The array of strings to normalize.
 * @returns {string} A normalized string representation of the array.
 */
export const normalizeQueryTableFilters = (arr?: string[]) =>
  arr?.length ? [...arr].sort().join(',') : ''

/**
 * Toggles an item in an array. If the item exists in the array, it is removed;
 * if it does not exist, it is added.
 *
 * @param array - The array to toggle the item in.
 * @param item - The item to toggle within the array.
 *
 * @returns A new array with the item either added or removed.
 *
 * @typeParam T - The type of items in the array.
 *
 * @example
 * toggleArrayItem([1, 2, 3], 2); // Returns [1, 3]
 * toggleArrayItem([1, 3], 2); // Returns [1, 3, 2]
 */
export function toggleArrayItem<T>(array: T[], item: T): T[] {
  return array.includes(item) ? array.filter((arrayItem) => arrayItem !== item) : [...array, item]
}

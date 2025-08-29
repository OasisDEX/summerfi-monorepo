import clone from 'lodash-es/clone'

/**
 * Recursively sets all values within an object or array to `null`.
 *
 * This function is designed to deeply traverse an object or array, setting every property or element to `null`.
 * This can be particularly useful in scenarios where you want to reset a configuration object, making it easy
 * to change the values later (e.g., when working with localStorage).
 *
 * @param object - The object or array to clean. Any non-object or non-array value will be replaced with `null`.
 * @returns A new object or array with all values set to `null`.
 */
// eslint-disable-next-line
export const cleanObjectToNull = (object: any): any => {
  // this is used to replace everything in config to null, so it's easy to change the values in localStorage
  let newObject = clone(object)

  if (object !== null) {
    switch (typeof newObject) {
      case 'object':
        if (Array.isArray(newObject)) {
          const { length } = newObject

          for (let i = 0; i < length; i++) {
            newObject[i] = cleanObjectToNull(newObject[i])
          }
        } else {
          Object.keys(newObject).forEach((key) => {
            newObject[key] = cleanObjectToNull(newObject[key])
          })
        }

        break
      default:
        newObject = null

        break
    }
  }

  return newObject
}

/**
 * Recursively removes all `null` values from an object or array.
 *
 * This function traverses an object or array and removes any properties or elements
 * that have a value of `null`. It can be particularly useful for cleaning up a configuration
 * object before storing or using it.
 *
 * @param obj - The object or array to clean. Any properties or elements with a value of `null` will be removed.
 * @returns A new object or array with all `null` values removed.
 */
// eslint-disable-next-line
export const cleanObjectFromNull = (obj: any): any => {
  // this is used to remove all null values from config
  const newObj = clone(obj)

  Object.keys(newObj).forEach((key) => {
    if (newObj[key] && typeof newObj[key] === 'object') {
      newObj[key] = cleanObjectFromNull(newObj[key])
    } else if (newObj[key] === null) {
      delete newObj[key]
    }
  })

  return newObj
}

import { type ReadonlyURLSearchParams } from 'next/navigation'

interface ParseQueryStringParams {
  searchParams: ReadonlyURLSearchParams
}

/**
 * Parses the query string parameters from the server-side request into an object
 * where each key maps to an array of values. This is useful for handling multiple
 * values for the same query parameter.
 *
 * @param searchParams - The `ReadonlyURLSearchParams` object containing the query string parameters.
 *
 * @returns An Promise<object> where each key is a query parameter and the value is an array
 *          of strings representing the corresponding values from the query string.
 *
 * @example
 * const searchParams = new URLSearchParams('param1=value1,value2&param2=value3');
 * const parsedParams = await parseQueryStringServerSide({ searchParams });
 * console.log(parsedParams);
 * // Output: { param1: ['value1', 'value2'], param2: ['value3'] }
 */
export async function parseQueryStringServerSide({
  searchParams,
}: ParseQueryStringParams): Promise<{
  [key: string]: string[]
}> {
  const resolvedSearchParams = await searchParams

  return Object.entries(resolvedSearchParams).reduce(
    (total, [key, value]) => ({
      ...total,
      [key]: value.split(','),
    }),
    {},
  )
}

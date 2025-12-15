/**
 * Parses a server response object to a client-friendly format. It is needed when passing server side fetched data to client components as props.
 *
 * This function attempts to convert a server response object into a JSON string and then parses it back into an object.
 * If the parsing is successful, the result is returned as the specified type `T`.
 * In case of an error during parsing, the original response is returned, and an error is logged to the console.
 *
 * @typeParam T - The expected type of the parsed response object.
 * @param response - The server response object to parse.
 * @returns The parsed response as type `T`, or the original response if parsing fails.
 */
export const parseServerResponseToClient = <T>(response: T): T => {
  try {
    return JSON.parse(JSON.stringify(response))
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to parse server response', e)

    return response
  }
}

type RecursiveObjectWithNumberInsteadOfBigInt<T> = {
  [K in keyof T]: T[K] extends bigint
    ? number
    : T[K] extends object
      ? RecursiveObjectWithNumberInsteadOfBigInt<T[K]>
      : T[K]
}

// same as above but changes bigint to string
export const parseJsonSafelyWithBigInt = <T>(
  response?: T,
): RecursiveObjectWithNumberInsteadOfBigInt<T> => {
  if (!response) {
    return response as RecursiveObjectWithNumberInsteadOfBigInt<T>
  }
  try {
    return JSON.parse(
      JSON.stringify(response, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value,
      ),
    )
  } catch (e) {
    // eslint-disable-next-line no-console
    throw console.error('Failed to safely parse response with BigInt', e)
  }
}

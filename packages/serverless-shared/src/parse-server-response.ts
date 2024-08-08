/**
 * Parse a server response into a specific type.
 *
 * This function attempts to parse a server response into a specified type `T`. If parsing fails, it returns an object containing the error and the original response.
 *
 * @template T - The expected type of the parsed response.
 * @param response - The server response to parse.
 * @returns The parsed response as type `T`, or an object containing the error and the original response.
 */
export const parseServerResponse = <T>(response: { [key: string | number]: unknown }) => {
  try {
    return JSON.parse(JSON.stringify(response)) as T
  } catch (e) {
    return {
      error: e,
      response,
    } as T
  }
}

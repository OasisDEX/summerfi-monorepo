/**
 * Safely parses a JSON string, returning an empty object if parsing fails
 * @param json - The JSON string to parse
 * @returns The parsed JSON object or an empty object if parsing fails
 */
export const safeParseJson = (json: string): any => {
  if (!json) {
    return {}
  }
  try {
    return JSON.parse(json)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error parsing JSON', error)

    return {}
  }
}

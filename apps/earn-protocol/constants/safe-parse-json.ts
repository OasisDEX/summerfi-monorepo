export const safeParseJson = (json: string) => {
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

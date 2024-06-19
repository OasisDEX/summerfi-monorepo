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

export const parseServerResponse = (response: { [key: string | number]: unknown }) => {
  try {
    return JSON.parse(JSON.stringify(response))
  } catch (e) {
    return {
      error: e,
      response,
    }
  }
}

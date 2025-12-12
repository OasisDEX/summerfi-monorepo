export const getCachedDefillamaProtocolTvl = async (
  defillamaProtocolName: string,
  originalProtocolName: string,
): Promise<{
  [protocol: string]: string
}> => {
  const url = `https://api.llama.fi/tvl/${defillamaProtocolName}`

  try {
    const response = await fetch(url, {
      next: {
        revalidate: 600, // 10 minutes
      },
    })
    const responseJson = await response.json()
    const tvl = String(responseJson)

    return {
      [originalProtocolName]: BigInt(tvl.includes('.') ? tvl.split('.')[0] : tvl).toString(),
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      `Error fetching TVL for ${defillamaProtocolName} (${originalProtocolName}) `,
      url,
      error,
    )

    return {
      [originalProtocolName]: BigInt(0).toString(),
    }
  }
}

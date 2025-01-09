export const getProtocolTvl = async (
  defillamaProtocolName: string,
  originalProtocolName: string,
): Promise<{
  [protocol: string]: bigint
}> => {
  try {
    const response = await fetch(`https://api.llama.fi/tvl/${defillamaProtocolName}`)
    const responseJson = await response.json()
    const tvl = String(responseJson)

    return {
      [originalProtocolName]: BigInt(tvl.includes('.') ? tvl.split('.')[0] : tvl),
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      `Error fetching TVL for ${defillamaProtocolName} (${originalProtocolName})`,
      error,
    )

    throw error
  }
}

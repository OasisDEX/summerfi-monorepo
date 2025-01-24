type MedianDefiYieldResponse = {
  timestamp: string
  uniquePools: number
  medianAPY: number
}[]

export const getMedianDefiYield = async (): Promise<number> => {
  try {
    const response = await fetch('https://yields.llama.fi/median')
    const medianData: MedianDefiYieldResponse = await response.json()
    const latestMedian = medianData[0].medianAPY

    return latestMedian
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error fetching median DeFi yield`, error)

    throw error
  }
}

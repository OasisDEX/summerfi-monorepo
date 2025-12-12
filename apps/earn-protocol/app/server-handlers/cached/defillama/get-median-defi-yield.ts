import dayjs from 'dayjs'

type MedianDefiYieldResponse = {
  timestamp: string
  uniquePools: number
  medianAPY: number
}[]

export const getCachedMedianDefiYield = async (): Promise<number> => {
  try {
    const response = await fetch('https://yields.llama.fi/median', {
      next: {
        revalidate: 600, // 10 minutes
      },
    })
    const medianData: MedianDefiYieldResponse = await response.json()

    if (!medianData.length) {
      // eslint-disable-next-line no-console
      console.error('No median data found')

      return 0
    }

    // figure out which way the array goes...
    // eslint-disable-next-line prefer-destructuring
    const firstMedian = medianData[0]
    const lastMedian = medianData[medianData.length - 1]

    const latestMedian =
      dayjs(firstMedian.timestamp) > dayjs(lastMedian.timestamp)
        ? firstMedian.medianAPY
        : lastMedian.medianAPY

    return latestMedian
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error fetching median DeFi yield`, error)

    throw error
  }
}

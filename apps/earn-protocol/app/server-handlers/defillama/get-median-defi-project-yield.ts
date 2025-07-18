import { REVALIDATION_TIMES } from '@summerfi/app-earn-ui'
import dayjs from 'dayjs'

type MedianDefiYieldResponse = {
  status: string
  data: {
    timestamp: string
    uniquePools: number
    medianAPY: number
  }[]
}

export const getMedianDefiProjectYield = async ({
  project,
}: {
  project: string
}): Promise<[number, number]> => {
  try {
    const response = await fetch(`https://yields.llama.fi/medianProject/${project}`, {
      next: {
        revalidate: REVALIDATION_TIMES.MEDIAN_DEFI_YIELD,
      },
    })
    const medianData: MedianDefiYieldResponse = await response.json()

    if (!medianData.data.length) {
      // eslint-disable-next-line no-console
      console.error('No median project data found', project)

      return [0, 0]
    }

    const medianDataSorted = medianData.data.sort(
      (a, b) => dayjs(a.timestamp).unix() - dayjs(b.timestamp).unix(),
    )

    const apyLatest = medianDataSorted[medianDataSorted.length - 1].medianAPY
    const apy30d = medianDataSorted[medianDataSorted.length - 30]?.medianAPY || 0

    return [apyLatest, apy30d]
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error fetching median DeFi yield`, error)

    throw error
  }
}

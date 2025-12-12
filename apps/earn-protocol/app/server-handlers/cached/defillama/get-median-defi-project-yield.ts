import dayjs from 'dayjs'

type MedianDefiYieldResponse = {
  status: string
  data: {
    timestamp: string
    uniquePools: number
    medianAPY: number
  }[]
}

type PoolYieldResponse = {
  status: string
  data: {
    timestamp: string
    tvlUsd: number
    apy: number
    apyBase: number
    apyReward: number
  }[]
}

const getCachedDefillamaPoolYield = async (poolId: string): Promise<[number, number]> => {
  try {
    const response = await fetch(`https://yields.llama.fi/chart/${poolId}`, {
      next: {
        revalidate: 600, // 10 minutes
      },
    })
    const data: PoolYieldResponse = await response.json()

    if (!data.data.length) {
      // eslint-disable-next-line no-console
      console.error('No pool data found', poolId)

      return [0, 0]
    }

    const sortedData = data.data.sort(
      (a, b) => dayjs(a.timestamp).unix() - dayjs(b.timestamp).unix(),
    )
    const last30ApyData = sortedData.slice(-30).map((d) => d.apy)
    const apyMax = Math.max(...last30ApyData)
    const apyMin = Math.min(...last30ApyData)

    return [apyMin, apyMax]
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error fetching pool yield`, error)

    throw error
  }
}

export const getCachedMedianDefiProjectYield = async ({
  project,
}: {
  project: string
}): Promise<[number, number]> => {
  try {
    if (project === 'ethena') {
      // Ethena is a special case, we need to fetch the pool yield instead
      return getCachedDefillamaPoolYield('66985a81-9c51-46ca-9977-42b4fe7bc6df') // Ethena USDe - Ethereum
    }
    const response = await fetch(`https://yields.llama.fi/medianProject/${project}`, {
      next: {
        revalidate: 600, // 10 minutes
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

    const last30ApyData = medianDataSorted.slice(-30).map((d) => d.medianAPY)

    const apyMax = Math.max(...last30ApyData)
    const apyMin = Math.min(...last30ApyData)

    return [apyMin, apyMax]
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error fetching median DeFi yield`, error)

    throw error
  }
}

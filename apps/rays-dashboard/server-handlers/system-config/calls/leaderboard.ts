import { getBuiltGraphSDK } from '@/.graphclient'

const getNumberOfPositions = (portfolioArray: any[]) => portfolioArray.length

export const fetchLeaderboard = async <T>(query: string): Promise<T> => {
  const sdk = getBuiltGraphSDK()

  const response = await fetch(`${process.env.FUNCTIONS_API_URL}/api/rays/leaderboard${query}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json())

  const results = await sdk
    .CrossSummerPoints({
      chainNames: ['', '-optimism', '-base', '-arbitrum'],
      addresses: response.leaderboard.map((item) => item.userAddress.toLowerCase()),
    })
    .then((data) => data.crossUsers)

  const mappedResults = results.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.id]: [...(acc[curr.id] || []), ...curr.positions],
    }
  }, {})

  const mappedNumberOfTriggers = Object.keys(mappedResults).reduce((acc, curr) => {
    return {
      ...acc,
      [curr]:
        Number(acc[curr] || 0) +
        mappedResults[curr].reduce((acc2, curr2) => acc2 + curr2.triggers.length, 0),
    }
  }, {})

  return {
    leaderboard: response.leaderboard.map((item, idx) => ({
      ...item,
      positions: `${getNumberOfPositions(mappedResults[item.userAddress.toLowerCase()])} positions, ${mappedNumberOfTriggers[item.userAddress.toLowerCase()]} automations`,
      // test: mappedResults,
      // test1: results,
      // test: mappedNumberOfTriggers,
    })),
  }
}

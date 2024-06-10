import { Leaderboard } from '@summerfi/rays-db'

import { getBuiltGraphSDK, Position } from '@/.graphclient'

const getNumberOfPositions = (portfolioArray: any[]) => portfolioArray.length

export const fetchLeaderboard = async (query: string) => {
  const sdk = getBuiltGraphSDK()

  const response = (await fetch(`${process.env.FUNCTIONS_API_URL}/api/rays/leaderboard${query}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json())) as { leaderboard: Leaderboard[] }

  // fetch info about positions from subgraph
  const results = await sdk
    .CrossSummerPoints({
      chainNames: ['', '-optimism', '-base', '-arbitrum'],
      addresses: response.leaderboard.map((item) => item.userAddress?.toLowerCase()),
    })
    .then((data) => data.crossUsers)

  // reduce positions list from different networks by user address
  const reducedPositions = results.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.id]: [...(acc[curr.id] || []), ...curr.positions],
    }),
    {} as { [key: string]: Position[] },
  )

  // reduce active triggers list to number from different networks by user address
  const reducedNumberOfTriggers = Object.keys(reducedPositions).reduce<{ [key: string]: number }>(
    (acc, curr) => ({
      ...acc,
      [curr]:
        Number(acc[curr] || 0) +
        reducedPositions[curr].reduce((acc2, curr2) => acc2 + curr2.triggers.length, 0),
    }),
    {},
  )

  return {
    leaderboard: response.leaderboard.map((item, idx) => {
      const numberOfPositions = item.userAddress
        ? getNumberOfPositions(reducedPositions[item.userAddress.toLowerCase()])
        : 1 // fallback to 1

      const numberOfActiveTriggers = item.userAddress
        ? reducedNumberOfTriggers[item.userAddress.toLowerCase()]
        : 0 // fallback to 0

      return {
        ...item,
        positions: `${numberOfPositions} positions, ${numberOfActiveTriggers} automations`,
      }
    }),
  }
}

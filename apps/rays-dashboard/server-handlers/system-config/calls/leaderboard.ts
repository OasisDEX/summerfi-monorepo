/* eslint-disable no-magic-numbers */

import { Leaderboard } from '@summerfi/rays-db'

import { getBuiltGraphSDK, Position } from '@/.graphclient'

// empty string stands for ethereum, the rest is defined with '-' to ease handling of network parameter in .graphclientrc.yml
// it is later resolved in ./the-graph/resolver.ts
const chainNames = ['', '-optimism', '-base', '-arbitrum']

export const fetchLeaderboard = async (query: string) => {
  const sdk = getBuiltGraphSDK()

  const response = (await fetch(`${process.env.FUNCTIONS_API_URL}/api/rays/leaderboard${query}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((resp) => resp.json())) as { leaderboard: Leaderboard[] }

  // fetch info about positions from subgraph
  const results = await sdk
    // eslint-disable-next-line new-cap
    .CrossSummerPoints({
      chainNames,
      addresses: response.leaderboard.map((item) => item.userAddress?.toLowerCase()),
    })
    .then((data) => data.crossUsers)

  // reduce positions list from different networks by user address
  const reducedPositions = results.reduce<{ [key: string]: Position[] }>(
    (acc, curr) => ({
      ...acc,
      [curr.id]: [...(acc[curr.id] || []), ...curr.positions],
    }),
    {},
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
    leaderboard: response.leaderboard.map((item) => {
      const numberOfPositions = item.userAddress
        ? reducedPositions[item.userAddress.toLowerCase()].length
        : 1

      const numberOfActiveTriggers = item.userAddress
        ? reducedNumberOfTriggers[item.userAddress.toLowerCase()]
        : 0

      return {
        ...item,
        positions: `${numberOfPositions} positions, ${numberOfActiveTriggers} automations`,
      }
    }),
  }
}

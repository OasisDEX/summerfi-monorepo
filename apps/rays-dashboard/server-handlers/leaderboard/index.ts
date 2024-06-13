/* eslint-disable no-magic-numbers */

import { Leaderboard } from '@summerfi/rays-db'

export const fetchLeaderboard = async (query: string) => {
  const response = (await fetch(`${process.env.FUNCTIONS_API_URL}/api/rays/leaderboard${query}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((resp) => resp.json())) as {
    leaderboard: (Leaderboard & { details: { activePositions: number; activeTriggers: number } })[]
  }

  return {
    leaderboard: response.leaderboard.map((item) => {
      return {
        position: item.position,
        userAddress: item.userAddress,
        totalPoints: item.totalPoints,
        positions: `${item.details.activePositions} positions, ${item.details.activeTriggers} automations`,
      }
    }),
  }
}

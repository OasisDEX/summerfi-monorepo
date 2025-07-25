import { Button, Icon } from '@summerfi/app-earn-ui'
import { formatAddress, timeAgo } from '@summerfi/app-utils'
import { type JsonValue } from '@summerfi/summer-protocol-db'
import dayjs from 'dayjs'
import Link from 'next/link'

import { ResponseTimesChart } from '@/app/secure/game-leaderboard/ResponseTimesChart'
import { getRoundTime } from '@/features/game/helpers/gameHelpers'

import { AntiCheatScore } from './AntiCheatScore'
import { type GameEntry, type SacScore } from './types'

import styles from './GamesList.module.css'

const getResponseTimesScore = (responseTimes: JsonValue): SacScore => {
  if (!Array.isArray(responseTimes) || responseTimes.length === 0) {
    return { score: 0, explanation: 'No response times' }
  }

  if (responseTimes.length < 3) {
    return {
      score: 100,
      explanation: 'Not enough rounds to assess (less than 3)',
    }
  }

  // Convert to numbers and filter out invalid values
  const times = responseTimes
    .map(Number)
    .filter((t, i) => !isNaN(t) && t > 0 && t < 5 && t < getRoundTime(i))

  if (times.length < 3) {
    return {
      score: 100,
      explanation: 'Not enough valid rounds to assess',
    }
  }

  // Calculate mean and standard deviation
  const mean = times.reduce((a, b) => a + b, 0) / times.length
  const stdDev = Math.sqrt(
    times.reduce((sum, t) => sum + Number((t - mean) ** 2), 0) / times.length,
  )

  // Human reaction times: mean ~0.25-0.7s, stdDev usually >0.05s
  // Penalize if mean is too low/high or stdDev is too low (bot-like)
  let score = 100
  let explanation = ''

  if (mean < 0.2 || mean > 1.5) {
    score -= 40
    explanation += `Mean (${mean.toFixed(4)}) is too low/high. `
  } else if (mean < 0.3 || mean > 1.1) {
    score -= 20
    explanation += `Mean (${mean.toFixed(4)}) is slightly off. `
  }

  if (stdDev < 0.03) {
    score -= 40
    explanation += `Standard deviation (${stdDev.toFixed(4)}) is too low. `
  } else if (stdDev < 0.07) {
    score -= 20
    explanation += `Standard deviation (${stdDev.toFixed(4)}) is slightly off. `
  }

  // Penalize if too many identical or near-identical times (bots)
  const identicalCount = times.filter(
    (t, i, arr) => i > 0 && Math.abs(t - arr[i - 1]) < 0.01,
  ).length

  if (identicalCount > times.length * 0.3) score -= 30

  // Clamp score between 0 and 100
  return {
    score: Math.max(0, Math.min(100, Math.round(score))),
    explanation: explanation.trim() || 'No issues detected',
    mean: Number(mean.toFixed(4)),
    stdDev: Number(stdDev.toFixed(4)),
  }
}

const getAverageResponseTime = (responseTimes: JsonValue): string => {
  if (!Array.isArray(responseTimes) || responseTimes.length === 0) return 'n/a'

  // Assume times are in seconds, convert to ms
  const times = responseTimes
    .map(Number)
    .filter((t) => !isNaN(t) && t > 0 && t < 5) // filter out invalid/very high values
    .map((t) => t * 1000)

  if (times.length === 0) return 'n/a'

  const mean = times.reduce((a, b) => a + b, 0) / times.length

  return `${Math.round(mean)} ms`
}

export function GamesList({
  gamesList,
  isLeaderboard = false,
  banUnbanUser,
  deleteScore,
}: {
  gamesList: GameEntry[]
  isLeaderboard?: boolean
  banUnbanUser: (formData: FormData) => Promise<void>
  deleteScore: (formData: FormData) => Promise<void>
}) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Name/Address</th>
          <th>Score</th>
          <th title="Summer Anti Cheat Score">SAC Score</th>
          <th>Avg. Response</th>
          <th>Response Times</th>
          <th>Is banned</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {gamesList.map((entry) => {
          const sacScore = getResponseTimesScore(entry.responseTimes)
          const averageResponseTime = getAverageResponseTime(entry.responseTimes)

          return (
            <tr key={entry.gameId}>
              <td>
                <Link href={`/portfolio/${entry.userAddress}`} target="_blank">
                  {entry.ens !== '' ? entry.ens : formatAddress(entry.userAddress)}
                </Link>
                <br />
                <span style={{ fontSize: '0.8em', color: '#666' }}>
                  {entry.gamesPlayed} games in total
                </span>
              </td>
              <td>
                {entry.score}
                <br />
                <span style={{ fontSize: '0.8em', color: '#666' }}>
                  {dayjs(Number(entry.updatedAt) * 1000).format('DD-MM-YYYY HH:mm:ss')}
                  <br />(
                  {timeAgo({
                    from: new Date(),
                    to: new Date(dayjs(Number(entry.updatedAt) * 1000).toDate()),
                  })}
                  )
                </span>
              </td>
              <td
                style={{
                  textAlign: 'center',
                }}
              >
                <AntiCheatScore sacScore={sacScore} entry={entry} />
              </td>
              <td>{averageResponseTime}</td>
              <td>
                <ResponseTimesChart responseTimes={entry.responseTimes} />
              </td>
              <td>{entry.isBanned ? <Icon iconName="checkmark" size={14} /> : '-'}</td>
              <td>
                <div className={styles.actions}>
                  {isLeaderboard && (
                    <form action={banUnbanUser}>
                      <input type="hidden" name="userAddress" value={entry.userAddress} />
                      <input
                        type="hidden"
                        name="isBanning"
                        value={!entry.isBanned ? 'true' : 'false'}
                      />
                      <Button type="submit" variant="primarySmall">
                        {entry.isBanned ? 'Unban' : 'Ban'}
                      </Button>
                    </form>
                  )}
                  <form action={deleteScore}>
                    <input type="hidden" name="userAddress" value={entry.userAddress} />
                    <input
                      type="hidden"
                      name="isLeaderboard"
                      value={isLeaderboard ? 'true' : 'false'}
                    />
                    <Button type="submit" variant="secondarySmall">
                      {isLeaderboard ? 'Delete Score' : 'Delete Game'}
                    </Button>
                  </form>
                </div>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

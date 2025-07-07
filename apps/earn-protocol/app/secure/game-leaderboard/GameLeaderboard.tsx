import { Button, Icon } from '@summerfi/app-earn-ui'
import { formatAddress } from '@summerfi/app-utils'
import { type JsonValue } from '@summerfi/summer-protocol-db'

import { ResponseTimesChart } from '@/app/secure/game-leaderboard/ResponseTimesChart'
import { getRoundTime } from '@/features/game/helpers/gameHelpers'

import styles from './GameLeaderboard.module.css'

const getResponseTimesScore = (
  responseTimes: JsonValue,
): {
  score: number
  explanation: string
} => {
  if (!Array.isArray(responseTimes) || responseTimes.length < 3)
    return { score: 0, explanation: '' }

  // Convert to numbers and filter out invalid values
  const times = responseTimes
    .map(Number)
    .filter((t, i) => !isNaN(t) && t > 0 && t < 5 && t < getRoundTime(i))

  if (times.length < 3) return { score: 0, explanation: '' }

  // Calculate mean and standard deviation
  const mean = times.reduce((a, b) => a + b, 0) / times.length
  const stdDev = Math.sqrt(
    times.reduce((sum, t) => Number(sum + Number(t - mean)) ** 2, 0) / times.length,
  )

  // Human reaction times: mean ~0.25-0.7s, stdDev usually >0.05s
  // Penalize if mean is too low/high or stdDev is too low (bot-like)
  let score = 100
  let explanation = ''

  if (mean < 0.2 || mean > 1.5) {
    score -= 40
    explanation += 'Mean is too low/high. '
  } else if (mean < 0.3 || mean > 1.0) {
    score -= 20
    explanation += 'Mean is slightly off. '
  }

  if (stdDev < 0.03) {
    score -= 40
    explanation += 'Standard deviation is too low. '
  } else if (stdDev < 0.07) {
    score -= 20
    explanation += 'Standard deviation is slightly off. '
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

export function GameLeaderboard({
  gameLeaderboard,
  banUnbanUser,
  deleteScore,
}: {
  gameLeaderboard: {
    ens: string
    gameId: string
    isBanned: boolean
    responseTimes: JsonValue
    score: string
    signedMessage: string
    updatedAt: string
    userAddress: string
    gamesPlayed: number
  }[]
  banUnbanUser: (formData: FormData) => Promise<void>
  deleteScore: (formData: FormData) => Promise<void>
}) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Games played</th>
          <th>Score</th>
          <th>Rounds</th>
          <th title="Summer Anti Cheat Score">SAC Score</th>
          <th>Avg. Response</th>
          <th>Response Times</th>
          <th>Is banned</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {gameLeaderboard.map((entry) => {
          const sacScore = getResponseTimesScore(entry.responseTimes)
          const averageResponseTime = getAverageResponseTime(entry.responseTimes)

          return (
            <tr key={entry.gameId}>
              <td>{entry.ens !== '' ? entry.ens : formatAddress(entry.userAddress)}</td>
              <td>{entry.gamesPlayed}</td>
              <td>{entry.score}</td>
              <td>{((entry.responseTimes ?? []) as number[] | undefined)?.length ?? 'n/a'}</td>
              <td>
                <span
                  style={{
                    color: sacScore.score < 50 ? 'red' : 'inherit',
                    fontWeight: sacScore.score < 50 ? 'bold' : 'normal',
                  }}
                  title={sacScore.explanation}
                >
                  {sacScore.score}
                </span>
              </td>
              <td>{averageResponseTime}</td>
              <td>
                <ResponseTimesChart responseTimes={entry.responseTimes} />
              </td>
              <td>{entry.isBanned ? <Icon iconName="checkmark" size={14} /> : '-'}</td>
              <td>
                <div className={styles.actions}>
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
                  <form action={deleteScore}>
                    <input type="hidden" name="userAddress" value={entry.userAddress} />
                    <Button type="submit" variant="secondarySmall">
                      Delete Score
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

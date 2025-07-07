import { Button, Icon } from '@summerfi/app-earn-ui'
import { formatAddress } from '@summerfi/app-utils'
import { type JsonValue } from '@summerfi/summer-protocol-db'

import { ResponseTimesChart } from '@/app/secure/game-leaderboard/ResponseTimesChart'

import styles from './GameLeaderboard.module.css'

const getResponseTimesScore = (responseTimes: JsonValue): number => {
  if (!Array.isArray(responseTimes) || responseTimes.length === 0) return 0

  // Assume times are in seconds, convert to ms
  const times = responseTimes
    .map(Number)
    .filter((t) => !isNaN(t) && t > 0 && t < 5) // filter out invalid/very high values
    .map((t) => t * 1000)

  if (times.length === 0) return 0

  const mean = times.reduce((a, b) => a + b, 0) / times.length
  const variance = times.reduce((a, b) => a + Number((b - mean) ** 2), 0) / times.length
  const stdDev = Math.sqrt(variance)

  // Score starts at 100, penalize for:
  // - mean too low (<200ms) or too high (>1200ms)
  // - very low stdDev (<30ms, likely bot)
  // - too many outliers (reaction time <150ms or >2000ms)
  let score = 100

  if (mean < 200 || mean > 1200) score -= 40
  if (stdDev < 30) score -= 30
  if (times.filter((t) => t < 150 || t > 2000).length > times.length * 0.15) score -= 20

  return Math.max(0, Math.round(score))
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
        {gameLeaderboard.map((entry) => (
          <tr key={entry.gameId}>
            <td>{entry.ens !== '' ? entry.ens : formatAddress(entry.userAddress)}</td>
            <td>{entry.gamesPlayed}</td>
            <td>{entry.score}</td>
            <td>{((entry.responseTimes ?? []) as number[] | undefined)?.length ?? 'n/a'}</td>
            <td>
              <span
                style={{
                  color: getResponseTimesScore(entry.responseTimes) < 50 ? 'red' : 'inherit',
                  fontWeight: getResponseTimesScore(entry.responseTimes) < 50 ? 'bold' : 'normal',
                }}
              >
                {getResponseTimesScore(entry.responseTimes)}
              </span>
            </td>
            <td>{getAverageResponseTime(entry.responseTimes)}</td>
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
        ))}
      </tbody>
    </table>
  )
}

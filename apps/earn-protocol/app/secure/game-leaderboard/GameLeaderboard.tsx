import { Button, Icon } from '@summerfi/app-earn-ui'
import { formatAddress } from '@summerfi/app-utils'
import { type JsonValue } from '@summerfi/summer-protocol-db'

import { ResponseTimesChart } from '@/app/secure/game-leaderboard/ResponseTimesChart'

import styles from './GameLeaderboard.module.css'

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
  }[]
  banUnbanUser: (formData: FormData) => Promise<void>
  deleteScore: (formData: FormData) => Promise<void>
}) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Score</th>
          <th>Response Times</th>
          <th>Is banned</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {gameLeaderboard.map((entry) => (
          <tr key={entry.gameId}>
            <td>{entry.ens !== '' ? entry.ens : formatAddress(entry.userAddress)}</td>
            <td>{entry.score}</td>
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

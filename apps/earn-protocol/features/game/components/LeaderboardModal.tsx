import { useEffect, useState } from 'react'
import { SkeletonLine } from '@summerfi/app-earn-ui'
import { formatAddress, formatCryptoBalance } from '@summerfi/app-utils'

import { type LeaderboardResponse } from '@/features/game/types'

import styles from './LeaderboardModal.module.css'

interface LeaderboardModalProps {
  onClose: () => void
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ onClose }) => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardResponse>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    fetch('/earn/api/game/get-leaderboard')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }

        return response.json()
      })
      .then((leaderboard) => {
        setLeaderboardData(leaderboard || [])
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error fetching leaderboard data:', error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const getRankClassName = (index: number) => {
    if (index === 0) return styles.gold
    if (index === 1) return styles.silver
    if (index === 2) return styles.bronze

    return ''
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Leaderboard</h2>
        <table className={styles.leaderboardTable}>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Address</th>
              <th>Score</th>
              <th>Avg. Response</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? // Skeleton Loader
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td>
                      <SkeletonLine height={15} width={20} />
                    </td>
                    <td>
                      <SkeletonLine height={15} width={120} />
                    </td>
                    <td>
                      <SkeletonLine height={15} width={50} />
                    </td>
                    <td>
                      <SkeletonLine height={15} width={80} />
                    </td>
                  </tr>
                ))
              : // Actual Data
                leaderboardData.map((entry, index) => (
                  <tr key={entry.userAddress} className={getRankClassName(index)}>
                    <td>{index + 1}</td>
                    <td>{formatAddress(entry.userAddress)}</td>
                    <td>{entry.score}</td>
                    <td>{formatCryptoBalance(entry.avgResponseTime)}s</td>
                  </tr>
                ))}
          </tbody>
        </table>
        <button className={styles.closeBtn} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}

export default LeaderboardModal

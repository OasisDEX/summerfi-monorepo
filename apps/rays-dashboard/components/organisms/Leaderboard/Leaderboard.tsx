'use client'

import { type FC } from 'react'
import { SkeletonLine, Table, Text } from '@summerfi/app-ui'

import {
  leaderboardColumns,
  type mapLeaderboardColumns,
} from '@/components/organisms/Leaderboard/columns'

import leaderboardStyles from '@/components/organisms/Leaderboard/Leaderboard.module.css'

interface LeaderboardProps {
  leaderboardData?: ReturnType<typeof mapLeaderboardColumns>
  isError?: boolean
  isLoading?: boolean
  title?: string
}

export const Leaderboard: FC<LeaderboardProps> = ({
  leaderboardData,
  isError,
  isLoading,
  title,
}) => {
  const isZeroResults = leaderboardData?.length === 0

  return (
    <div className={leaderboardStyles.leaderboardWrapper}>
      <div className={leaderboardStyles.headingWrapper}>
        <Text as="h2" variant="h2">
          {title ? title : 'Leaderboard'}
        </Text>
      </div>
      {isError && (
        <div className={leaderboardStyles.errorWrapper}>
          <Text as="h5" variant="h5">
            There was a problem loading the leaderboard. Please try again.
          </Text>
        </div>
      )}
      {isLoading && (
        <Table
          columns={Object.values(leaderboardColumns).map((item, idx) => ({
            title: (
              <Text key={idx} as="h5" variant="h5" style={{ fontWeight: 500 }}>
                {item.title}
              </Text>
            ),
          }))}
          rows={[
            {
              cells: Array(Object.values(leaderboardColumns).length).fill(
                <SkeletonLine height={30} />,
              ),
            },
          ]}
        />
      )}
      {leaderboardData && !isLoading && (
        <Table
          columns={Object.values(leaderboardColumns).map((item, idx) => ({
            title: (
              <Text key={idx} as="h5" variant="h5" style={{ fontWeight: 500 }}>
                {item.title}
              </Text>
            ),
          }))}
          rows={leaderboardData}
        />
      )}
      {isZeroResults && !isLoading && (
        <div className={leaderboardStyles.errorWrapper}>
          <Text as="h5" variant="h5">
            No results found
          </Text>
        </div>
      )}
    </div>
  )
}

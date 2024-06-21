'use client'

import { FC } from 'react'
import { SkeletonLine, Table, Text } from '@summerfi/app-ui'

import {
  leaderboardColumns,
  mapLeaderboardColumns,
} from '@/components/organisms/Leaderboard/columns'

import classNames from '@/components/organisms/Leaderboard/Leaderboard.module.scss'

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
    <div className={classNames.leaderboardWrapper}>
      <div className={classNames.headingWrapper}>
        <Text as="h2" variant="h2">
          {title ? title : 'Leaderboard'}
        </Text>
      </div>
      {isError && (
        <div className={classNames.errorWrapper}>
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
        <div className={classNames.errorWrapper}>
          <Text as="h5" variant="h5">
            No results found
          </Text>
        </div>
      )}
    </div>
  )
}

'use client'

import { FC } from 'react'
import { Table, Text } from '@summerfi/app-ui'

import {
  leaderboardColumns,
  mapLeaderboardColumns,
} from '@/components/organisms/Leaderboard/columns'
import { LeaderboardSearchBox } from '@/components/organisms/Leaderboard/LeaderboardSearchBox'

import classNames from '@/components/organisms/Leaderboard/Leaderboard.module.scss'

interface LeaderboardProps {
  leaderboardData?: ReturnType<typeof mapLeaderboardColumns>
  onInputUpdate?: (input?: string) => void
  isError?: boolean
}

export const Leaderboard: FC<LeaderboardProps> = ({ leaderboardData, onInputUpdate, isError }) => {
  const isZeroResults = leaderboardData?.length === 0

  return (
    <div className={classNames.leaderboardWrapper}>
      <div className={classNames.headingWrapper}>
        <Text as="h2" variant="h2">
          Leaderboard
        </Text>
        {onInputUpdate && <LeaderboardSearchBox onInputUpdate={onInputUpdate} />}
      </div>
      {isError && (
        <div className={classNames.errorWrapper}>
          <Text as="h5" variant="h5">
            There was a problem loading the leaderboard. Please try again.
          </Text>
        </div>
      )}
      {isZeroResults && (
        <div className={classNames.errorWrapper}>
          <Text as="h5" variant="h5">
            No results found
          </Text>
        </div>
      )}

      {leaderboardData && (
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
    </div>
  )
}

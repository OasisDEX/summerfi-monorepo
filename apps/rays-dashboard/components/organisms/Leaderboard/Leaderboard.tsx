/* eslint-disable no-magic-numbers */
'use client'

import { ChangeEvent, FC, useEffect, useState } from 'react'
import { Button, Icon, Input, Table, Text } from '@summerfi/app-ui'

import {
  leaderboardColumns,
  mapLeaderboardColumns,
} from '@/components/organisms/Leaderboard/columns'
import { LeaderboardResponse } from '@/types/leaderboard'

import classNames from '@/components/organisms/Leaderboard/Leaderboard.module.scss'

interface LeaderboardProps {
  pagination?: {
    page: number
    limit: number
  }
}

export const Leaderboard: FC<LeaderboardProps> = ({
  pagination = {
    page: 1,
    limit: 5,
  },
}) => {
  const [leaderboardResponse, setLeaderboardResponse] = useState<LeaderboardResponse>({
    leaderboard: [],
  })
  const [page, setPage] = useState(pagination.page)
  const [isLoading, setIsLoading] = useState(true)
  const [input, setInput] = useState('')
  const [debouncedInput, setDebouncedInput] = useState('')

  useEffect(() => {
    setIsLoading(true)
    fetch(
      `/api/leaderboard?page=${page}&limit=${pagination.limit}${debouncedInput ? `&userAddress=${debouncedInput}` : ''}`,
    )
      .then((data) => data.json())
      .then((data) => {
        const castedData = data as LeaderboardResponse

        if (debouncedInput) {
          setPage(1)
          setLeaderboardResponse(castedData)
        } else {
          setLeaderboardResponse((prev) => {
            const mergedLeaderboard = [...prev.leaderboard, ...castedData.leaderboard]

            return {
              ...castedData,
              // in general there shouldn't be kur, but just in case filter out if exists
              // (duplicates may occur while developing due to hot reloads)
              leaderboard: mergedLeaderboard.filter(
                (obj, index) =>
                  index === mergedLeaderboard.findIndex((o) => obj.userAddress === o.userAddress),
              ),
            }
          })
        }
        setIsLoading(false)
      })
  }, [page, debouncedInput])

  const mappedLeaderBoard = mapLeaderboardColumns({
    leaderboardData: leaderboardResponse.leaderboard,
    // TODO use connectedWallet address once available
    connectedWalletAddress: '0xB710940E3659415ebd5492f43B247891De14D872',
  })

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedInput(input as string), 300)

    return () => clearTimeout(timeout)
  }, [input])

  return (
    <>
      <div className={classNames.headingWrapper}>
        <Text as="h2" variant="h2">
          Leaderboard
        </Text>
        <Input
          value={input}
          style={{ minWidth: '320px' }}
          placeholder="Search wallet address or ENS"
          icon={{ name: 'search_icon' }}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if ('value' in e.target) {
              const { value } = e.target

              setPage(1)

              if (value === '') {
                setLeaderboardResponse({ leaderboard: [] })
              }

              setInput(value as string)
            }
          }}
        />
      </div>
      {leaderboardResponse.error && (
        <div className={classNames.errorWrapper}>
          <Text as="h5" variant="h5">
            There was a problem loading the leaderboard. Please try again.
          </Text>
        </div>
      )}
      {!!debouncedInput.length &&
        !leaderboardResponse.leaderboard.length &&
        !leaderboardResponse.error && (
          <div className={classNames.errorWrapper}>
            <Text as="h5" variant="h5">
              No results found
            </Text>
          </div>
        )}
      {!!leaderboardResponse.leaderboard.length && !leaderboardResponse.error && (
        <>
          <Table
            columns={Object.values(leaderboardColumns).map((item, idx) => ({
              title: (
                <Text key={idx} as="h5" variant="h5" style={{ fontWeight: 500 }}>
                  {item.title}
                </Text>
              ),
            }))}
            rows={mappedLeaderBoard}
          />
          {!input && (
            <Button
              variant="unstyled"
              disabled={isLoading}
              onClick={() => setPage((prev) => prev + 1)}
            >
              <Text
                as="p"
                variant="p3semi"
                style={{
                  color: 'var(--color-text-interactive',
                  display: 'flex',
                  alignItems: 'center',
                  columnGap: '8px',
                }}
              >
                {isLoading ? (
                  <>Loading...</>
                ) : (
                  <>
                    <Icon iconName="chevron_down" variant="xs" /> See more
                  </>
                )}
              </Text>
            </Button>
          )}
        </>
      )}
    </>
  )
}

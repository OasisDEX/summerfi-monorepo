/* eslint-disable no-magic-numbers */
'use client'

import { ChangeEvent, FC, useEffect, useState } from 'react'
import { Button, Icon, Input, Table, Text } from '@summerfi/app-ui'

import {
  leaderboardColumns,
  mapLeaderboardColumns,
} from '@/components/organisms/Leaderboard/columns'
import { LeaderboardSkeleton } from '@/components/organisms/Leaderboard/LeaderboardSkeleton'
import { LeaderboardResponse } from '@/types/leaderboard'

import classNames from '@/components/organisms/Leaderboard/Leaderboard.module.scss'

interface LeaderboardProps {
  pagination?: {
    page: number
    limit: number
  }
  staticLeaderboardData?: LeaderboardResponse
}

export const Leaderboard: FC<LeaderboardProps> = ({
  pagination = {
    page: 1,
    limit: 5,
  },
  staticLeaderboardData,
}) => {
  const [leaderboardResponse, setLeaderboardResponse] = useState<LeaderboardResponse>({
    leaderboard: staticLeaderboardData?.leaderboard || [],
  })
  const [page, setPage] = useState(pagination.page)
  const [isLoading, setIsLoading] = useState(!staticLeaderboardData)

  const [input, setInput] = useState('')
  const [debouncedInput, setDebouncedInput] = useState('')

  // to be called on action or during leaderboard initialization when staticLeaderboardData is not defined
  const leaderboardUpdate = async ({
    page,
    resetStatic,
    overwrite,
    input,
  }: {
    page?: number
    resetStatic?: LeaderboardResponse
    overwrite?: boolean
    input?: string
  }) => {
    // to be used when server, or other source leaderboard data is already available
    if (resetStatic) {
      setLeaderboardResponse(resetStatic)

      return
    }

    setIsLoading(true)

    const data = await fetch(
      `/api/leaderboard?page=${page}&limit=${pagination.limit}${input ? `&userAddress=${input}` : ''}`,
    ).then((data) => data.json())

    const castedData = data as LeaderboardResponse

    setLeaderboardResponse((prev) => {
      const mergedLeaderboard = overwrite
        ? castedData.leaderboard
        : [...prev.leaderboard, ...castedData.leaderboard]

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

    setIsLoading(false)
  }

  const mappedLeaderBoard = mapLeaderboardColumns({
    leaderboardData: leaderboardResponse.leaderboard,
    // TODO use connectedWallet address once available
    connectedWalletAddress: '0xB710940E3659415ebd5492f43B247891De14D872',
  })

  useEffect(() => {
    if (staticLeaderboardData && !input) {
      setDebouncedInput(input as string)
      void leaderboardUpdate({ resetStatic: staticLeaderboardData })

      return
    }

    const time = !input ? 0 : 300

    const timeout = setTimeout(() => {
      const page = pagination.page || 1

      setPage(page)
      setDebouncedInput(input as string)
      void leaderboardUpdate({ page, overwrite: true, input })
    }, time)

    return () => clearTimeout(timeout)
  }, [input])

  const resolvedSkeletonLoading =
    (isLoading && debouncedInput) || (isLoading && !leaderboardResponse.leaderboard.length)
  const isError = leaderboardResponse.error
  const isZeroResults =
    !!debouncedInput.length && !leaderboardResponse.leaderboard.length && !isError

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

              setInput(value as string)
            }
          }}
        />
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
      {resolvedSkeletonLoading && <LeaderboardSkeleton />}

      {!resolvedSkeletonLoading && !!leaderboardResponse.leaderboard.length && (
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
          {!debouncedInput && (
            <Button
              variant="unstyled"
              disabled={isLoading}
              onClick={async () => {
                setPage((prev) => prev + 1)
                void leaderboardUpdate({ page: page + 1 })
              }}
            >
              <Text
                as="p"
                variant="p3semi"
                style={{
                  color: 'var(--color-text-interactive)',
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

/* eslint-disable no-magic-numbers */
'use client'

import { ChangeEvent, FC, useEffect, useState } from 'react'
import { Button, Icon, Input, SkeletonLine, Table, Text } from '@summerfi/app-ui'

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
  serverLeaderboardResponse: LeaderboardResponse['leaderboard']
}

const LeaderboardSkeleton = () => {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        rowGap: '30px',
        flexDirection: 'column',
        marginTop: '20px',
      }}
    >
      <SkeletonLine height={20} />
      <SkeletonLine height={20} />
      <SkeletonLine height={20} />
      <SkeletonLine height={20} />
      <SkeletonLine height={20} />
      <SkeletonLine height={20} />
      <SkeletonLine height={20} />
    </div>
  )
}

export const Leaderboard: FC<LeaderboardProps> = ({
  pagination = {
    page: 1,
    limit: 5,
  },
  serverLeaderboardResponse,
}) => {
  const [leaderboardResponse, setLeaderboardResponse] = useState<LeaderboardResponse>({
    leaderboard: serverLeaderboardResponse,
  })
  const [searchLeaderboardResponse, setSearchLeaderboardResponse] = useState<LeaderboardResponse>({
    leaderboard: [],
  })
  const [page, setPage] = useState(pagination.page)
  const [isLoading, setIsLoading] = useState(false)
  const [freshStart, setFreshStart] = useState(false)
  const [input, setInput] = useState('')
  const [debouncedInput, setDebouncedInput] = useState('')

  useEffect(() => {
    if (page === 1 && !debouncedInput) {
      return
    }
    setIsLoading(true)
    fetch(`/api/leaderboard?page=${page}&limit=${pagination.limit}`)
      .then((data) => data.json())
      .then((data) => {
        const castedData = data as LeaderboardResponse

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
        setIsLoading(false)
        setFreshStart(false)
      })
  }, [page, freshStart, pagination.limit, debouncedInput])

  useEffect(() => {
    if (!debouncedInput) {
      return
    }
    setIsLoading(true)
    fetch(`/api/leaderboard?limit=${pagination.limit}&userAddress=${debouncedInput}`)
      .then((data) => data.json())
      .then((data) => {
        const castedData = data as LeaderboardResponse

        setSearchLeaderboardResponse(castedData)
        setIsLoading(false)
        setFreshStart(false)
      })
  }, [debouncedInput, pagination.limit])

  const mappedLeaderBoard = mapLeaderboardColumns({
    leaderboardData: leaderboardResponse.leaderboard,
    // TODO use connectedWallet address once available
    connectedWalletAddress: '0xB710940E3659415ebd5492f43B247891De14D872',
  })

  const mappedSearchLeaderBoard = mapLeaderboardColumns({
    leaderboardData: searchLeaderboardResponse.leaderboard,
    // TODO use connectedWallet address once available
    connectedWalletAddress: '0xB710940E3659415ebd5492f43B247891De14D872',
  })

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!input) {
        setFreshStart(true)
      }
      setDebouncedInput(input as string)
    }, 300)

    return () => clearTimeout(timeout)
  }, [input])

  const isLoadingGivenAddress = isLoading && debouncedInput
  const isLoadingFirstItems = isLoading && freshStart
  const resolvedSkeletonLoading = isLoadingGivenAddress || isLoadingFirstItems

  const resolvedMappedLeaderboard = debouncedInput ? mappedSearchLeaderBoard : mappedLeaderBoard
  const resolvedLeaderboardResponse = debouncedInput
    ? searchLeaderboardResponse
    : leaderboardResponse

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
      {resolvedLeaderboardResponse.error && (
        <div className={classNames.errorWrapper}>
          <Text as="h5" variant="h5">
            There was a problem loading the leaderboard. Please try again.
          </Text>
        </div>
      )}
      {!!debouncedInput.length &&
        !resolvedLeaderboardResponse.leaderboard.length &&
        !resolvedLeaderboardResponse.error && (
          <div className={classNames.errorWrapper}>
            <Text as="h5" variant="h5">
              No results found
            </Text>
          </div>
        )}
      {resolvedSkeletonLoading && <LeaderboardSkeleton />}

      {!resolvedSkeletonLoading && !!resolvedLeaderboardResponse.leaderboard.length && (
        <>
          <Table
            columns={Object.values(leaderboardColumns).map((item, idx) => ({
              title: (
                <Text key={idx} as="h5" variant="h5" style={{ fontWeight: 500 }}>
                  {item.title}
                </Text>
              ),
            }))}
            rows={resolvedMappedLeaderboard}
          />
          {!debouncedInput && (
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

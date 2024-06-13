/* eslint-disable no-magic-numbers */

'use client'

import { ChangeEvent, useEffect, useState } from 'react'
import { Button, Icon, Table, Text } from '@summerfi/app-ui'
import Link from 'next/link'

interface LeaderboardItem {
  id: string
  position: string
  userAddress: string
  totalPoints: string
  positions: string
}

type LeaderboardResponse = LeaderboardItem[]

const columns = [
  {
    title: 'Rank',
    cellMapper: (cell: string) => (
      <Text as="p" variant="p1semi" style={{ color: 'var(--color-neutral-80)', minWidth: '160px' }}>
        {[1, 2, 3].includes(Number(cell)) ? <>{cell} 🏆</> : cell}
      </Text>
    ),
  },
  {
    title: 'User',
    cellMapper: (cell: string) => (
      <Text as="p" variant="p1semi">
        {cell}
      </Text>
    ),
  },
  {
    title: 'Rays',
    cellMapper: (cell: string) => (
      <Text as="p" variant="p1" style={{ color: 'var(--color-neutral-80)' }}>
        {new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Number(cell))}
      </Text>
    ),
  },
  {
    title: 'Summer portfolio',
    cellMapper: (cell: string) => (
      <Text as="p" variant="p2semi">
        <Link href={`/portfolio/${cell}`}> {cell} -&gt;</Link>
      </Text>
    ),
  },
]

const mappLeaderboardData = ({
  leaderboardData,
  connectedWalletAddress,
}: {
  leaderboardData: LeaderboardResponse
  connectedWalletAddress: string
}) => {
  const index = 4
  const hehe = leaderboardData.map((item) => ({
    cells: Object.values(item).map((cell, idx) => columns[idx].cellMapper(cell)),
  }))
  const value = {
    cells: (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          rowGap: '16px',
          background: 'linear-gradient(92deg, #fff3ef 0.78%, #f2fcff 99.57%)',
          padding: '16px',
          borderRadius: '16px',
        }}
      >
        <Text as="h5" variant="h5">
          How do I move up the leaderboard?
        </Text>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            columnGap: '24px',
          }}
        >
          <Button variant="neutralSmall">Enable Automations</Button>
          <Button variant="neutralSmall">Open a position</Button>
          <Button variant="neutralSmall">Use Swap</Button>
        </div>
      </div>
    ),
  }
  const newArr = [...hehe.slice(0, index), value, ...hehe.slice(index, hehe.length)]

  const userIndex = leaderboardData
    .map((item) => item.userAddress)
    .findIndex((item) => item.toLowerCase() === connectedWalletAddress.toLowerCase())

  if (userIndex !== -1) {
    const youAreHereValue = {
      cells: (
        <div style={{ paddingLeft: '12px' }}>
          <Text as="p" variant="p3semi">
            You&apos;re here 👇
          </Text>
        </div>
      ),
    }

    return [
      ...newArr.slice(0, userIndex + 1),
      youAreHereValue,
      ...newArr.slice(userIndex + 1, newArr.length),
    ]
  }

  return newArr
}

export const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardResponse>([])
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [input, setInput] = useState('')
  const [debouncedInput, setDebouncedInput] = useState('')

  useEffect(() => {
    setIsLoading(true)
    fetch(
      `/api/leaderboard?page=${page}&limit=5${debouncedInput ? `&userAddress=${debouncedInput}` : ''}`,
    )
      .then((data) => data.json())
      .then((data) => {
        const castedData = data as { leaderboard: LeaderboardResponse }

        if (debouncedInput) {
          setPage(1)
          setLeaderboardData(castedData.leaderboard)
        } else {
          setLeaderboardData((prev) => [...prev, ...castedData.leaderboard])
        }
        setIsLoading(false)
      })
  }, [page, debouncedInput])

  const mappedLeaderBoard = mappLeaderboardData({
    leaderboardData,
    connectedWalletAddress: '0xB710940E3659415ebd5492f43B247891De14D872',
  })

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedInput(input as string), 300)

    return () => clearTimeout(timeout)
  }, [input])

  return (
    <>
      <Text as="h2" variant="h2">
        Leaderboard
      </Text>
      <input
        value={input}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if ('value' in e.target) {
            const { value } = e.target

            setPage(1)

            if (value === '') {
              setLeaderboardData([])
            }

            setInput(value as string)
          }
        }}
      />
      {leaderboardData.length && (
        <>
          <Table
            columns={columns.map((item, idx) => ({
              title: (
                <Text key={idx} as="h5" variant="h5" style={{ fontWeight: 500 }}>
                  {item.title}
                </Text>
              ),
            }))}
            rows={mappedLeaderBoard}
          />
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
                  <Icon iconName="chevron_down" /> See more
                </>
              )}
            </Text>
          </Button>
        </>
      )}
    </>
  )
}

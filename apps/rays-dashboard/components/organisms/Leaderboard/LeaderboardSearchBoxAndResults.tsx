'use client'
import { ChangeEvent, useEffect, useState } from 'react'
import { Input } from '@summerfi/app-ui'
import { IconX } from '@tabler/icons-react'

import { mapLeaderboardColumns } from '@/components/organisms/Leaderboard/columns'
import { Leaderboard } from '@/components/organisms/Leaderboard/Leaderboard'
import { LeaderboardResponse } from '@/types/leaderboard'

import leaderboardSearchBoxAndResults from './LeaderboardSearchBoxAndResults.module.scss'

export const LeaderboardSearchBoxAndResults = () => {
  const [input, setInput] = useState('')
  const [debouncedInput, setDebouncedInput] = useState('')
  const [leaderboardResponse, setLeaderboardResponse] = useState<LeaderboardResponse>()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!input) {
      setDebouncedInput(input as string)

      return undefined
    }

    const time = !input ? 0 : 300

    const timeout = setTimeout(() => {
      setDebouncedInput(input as string)
    }, time)

    return () => {
      clearTimeout(timeout)
    }
  }, [input])

  useEffect(() => {
    const leaderboardDataUpdate = async () => {
      setIsLoading(true)
      setLeaderboardResponse(undefined)
      const data = await fetch(
        `/rays/api/leaderboard?page=1&limit=5&userAddress=${debouncedInput.toLocaleLowerCase()}`,
      ).then((resp) => resp.json())
      const castedData = data as LeaderboardResponse

      setLeaderboardResponse(castedData)
      setIsLoading(false)
    }

    if (debouncedInput) {
      leaderboardDataUpdate()
    } else {
      setLeaderboardResponse(undefined)
    }
  }, [debouncedInput])

  const mappedLeaderBoard = leaderboardResponse
    ? mapLeaderboardColumns({
        leaderboardData: leaderboardResponse.leaderboard,
        userWalletAddress: debouncedInput,
        skipBanner: true,
      })
    : []

  return (
    <>
      <div className={leaderboardSearchBoxAndResults.inputWrapper}>
        <Input
          value={input}
          style={{
            minWidth: '320px',
            paddingRight: '50px',
            backgroundColor: 'var(--color-neutral-10)',
          }}
          placeholder="Search wallet address or ENS"
          icon={{ name: 'search_icon' }}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if ('value' in e.target) {
              const { value } = e.target

              setInput(value as string)
            }
          }}
        />
        {debouncedInput && (
          <IconX
            onClick={() => {
              setInput('')
              setDebouncedInput('')
            }}
            style={{ cursor: 'pointer', position: 'absolute', top: '15px', right: '15px' }}
          />
        )}
      </div>
      {debouncedInput ? (
        <Leaderboard
          title="Search results"
          isLoading={isLoading}
          leaderboardData={mappedLeaderBoard}
        />
      ) : null}
    </>
  )
}

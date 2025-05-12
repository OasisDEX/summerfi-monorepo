'use client'
import { type ChangeEvent, useEffect, useState } from 'react'
import { type LeaderboardResponse } from '@summerfi/app-types'
import { Input } from '@summerfi/app-ui'
import { IconX } from '@tabler/icons-react'
import { usePathname } from 'next/navigation'

import { mapLeaderboardColumns } from '@/components/organisms/Leaderboard/columns'
import { Leaderboard } from '@/components/organisms/Leaderboard/Leaderboard'
import { basePath } from '@/helpers/base-path'
import { trackInputChange } from '@/helpers/mixpanel'
import { type FetchRaysReturnType } from '@/server-handlers/rays'

import leaderboardSearchBoxAndResults from './LeaderboardSearchBoxAndResults.module.css'

export const LeaderboardSearchBoxAndResults = () => {
  const [input, setInput] = useState('')
  const [debouncedInput, setDebouncedInput] = useState('')
  const [leaderboardResponse, setLeaderboardResponse] = useState<LeaderboardResponse>()
  const [userRaysResponse, setUserRaysResponse] = useState<FetchRaysReturnType>()
  const [isLoading, setIsLoading] = useState(false)
  const currentPath = usePathname()

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
      trackInputChange({
        id: 'LeaderboardSearch',
        page: currentPath,
        value: debouncedInput,
      })
      setIsLoading(true)
      setLeaderboardResponse(undefined)
      const [leaderboardData, raysData] = (await Promise.all([
        fetch(
          `${basePath}/api/leaderboard?page=1&limit=5&userAddress=${debouncedInput.toLocaleLowerCase()}`,
        ).then((resp) => resp.json()),
        fetch(`${basePath}/api/rays?address=${debouncedInput.toLocaleLowerCase()}`).then((resp) =>
          resp.json(),
        ),
      ])) as [LeaderboardResponse, FetchRaysReturnType]

      setLeaderboardResponse(leaderboardData)
      setUserRaysResponse(raysData)
      setIsLoading(false)
    }

    if (debouncedInput) {
      leaderboardDataUpdate()
    } else {
      setLeaderboardResponse(undefined)
    }
  }, [currentPath, debouncedInput])

  const mappedLeaderBoard = leaderboardResponse
    ? mapLeaderboardColumns({
        leaderboardData: leaderboardResponse.leaderboard,
        userWalletAddress: debouncedInput,
        skipBanner: true,
        page: currentPath,
        userRays: userRaysResponse,
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

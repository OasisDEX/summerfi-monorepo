'use client'

import { ChangeEvent, useEffect, useState } from 'react'
import { Input } from '@summerfi/app-ui'

export const LeaderboardSearchBox = ({
  onInputUpdate,
}: {
  onInputUpdate: (input?: string) => void
}) => {
  const [input, setInput] = useState('')

  useEffect(() => {
    if (!input) {
      onInputUpdate(input as string)

      return undefined
    }

    const time = !input ? 0 : 300

    const timeout = setTimeout(() => {
      onInputUpdate(input as string)
    }, time)

    return () => {
      clearTimeout(timeout)
    }
  }, [input, onInputUpdate])

  return (
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
  )
}

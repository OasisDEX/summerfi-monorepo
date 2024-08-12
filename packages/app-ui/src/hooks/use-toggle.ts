'use client'
import { type Dispatch, type SetStateAction, useCallback, useState } from 'react'

export const useToggle = (
  initialState: boolean,
): [boolean, () => void, Dispatch<SetStateAction<boolean>>] => {
  const [state, setState] = useState<boolean>(initialState)

  const toggle = useCallback(() => setState((nextState) => !nextState), [])

  return [state, toggle, setState]
}

'use client'
import { createContext, useContext, useReducer } from 'react'

type PanelUserState = { name: string }
type PanelUserAction = { type: 'dummy'; value: string }

const initialState: PanelUserState = { name: '' }

// dummy reducer for now
const reducer = (state: PanelUserState, action: PanelUserAction): PanelUserState => {
  switch (action.type) {
    case 'dummy':
      return { ...state, name: action.value }
    default:
      return state
  }
}

const PanelUserContext = createContext<{
  state: PanelUserState
  dispatch: React.Dispatch<PanelUserAction>
} | null>(null)

export function PanelUserProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <PanelUserContext.Provider value={{ state, dispatch }}>{children}</PanelUserContext.Provider>
  )
}

export function usePanelUser() {
  const ctx = useContext(PanelUserContext)

  if (!ctx) throw new Error('usePanelUser must be inside PanelUserProvider')

  return ctx
}

'use client'
import { createContext, useContext, useReducer } from 'react'

type PanelClientState = { name: string }
type PanelClientAction = { type: 'dummy'; value: string }

const initialState: PanelClientState = { name: '' }

// dummy reducer for now
const reducer = (state: PanelClientState, action: PanelClientAction): PanelClientState => {
  switch (action.type) {
    case 'dummy':
      return { ...state, name: action.value }
    default:
      return state
  }
}

const PanelClientContext = createContext<{
  state: PanelClientState
  dispatch: React.Dispatch<PanelClientAction>
} | null>(null)

export function PanelClientProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <PanelClientContext.Provider value={{ state, dispatch }}>
      {children}
    </PanelClientContext.Provider>
  )
}

export function usePanelClient() {
  const ctx = useContext(PanelClientContext)

  if (!ctx) throw new Error('usePanelClient must be inside PanelClientProvider')

  return ctx
}

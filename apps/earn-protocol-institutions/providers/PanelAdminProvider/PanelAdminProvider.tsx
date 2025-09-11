'use client'
import { createContext, useContext, useReducer } from 'react'
import { type UiTransactionStatuses } from '@summerfi/app-types'

import { type InstitutionVaultRole } from '@/types/institution-data'

export enum PanelAdminStep {
  INIT = 'init',
  PENDING = 'pending',
  COMPLETED = 'completed',
  ERROR = 'error',
}

type PanelAdminState = {
  step: PanelAdminStep
  txStatus: UiTransactionStatuses | undefined
  items: InstitutionVaultRole[]
}
type PanelAdminAction =
  | { type: 'edit-item'; payload: InstitutionVaultRole }
  | { type: 'update-step'; payload: PanelAdminStep }
  | { type: 'update-tx-status'; payload: UiTransactionStatuses | undefined }
  | { type: 'partial-reset'; payload?: Partial<PanelAdminState> }
  | { type: 'reset' }

const initialState: PanelAdminState = {
  step: PanelAdminStep.INIT,
  txStatus: undefined,
  items: [],
}

const reducer = (state: PanelAdminState, action: PanelAdminAction): PanelAdminState => {
  switch (action.type) {
    case 'edit-item':
      return {
        ...state,
        items: [...state.items.filter((item) => item.role !== action.payload.role), action.payload],
      }
    case 'update-step':
      return { ...state, step: action.payload }
    case 'update-tx-status':
      return { ...state, txStatus: action.payload }
    case 'partial-reset':
      return { ...state, ...action.payload }
    case 'reset':
      return initialState
    default:
      return state
  }
}

const PanelAdminContext = createContext<{
  state: PanelAdminState
  dispatch: React.Dispatch<PanelAdminAction>
} | null>(null)

export function PanelAdminProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <PanelAdminContext.Provider value={{ state, dispatch }}>{children}</PanelAdminContext.Provider>
  )
}

export function usePanelAdmin() {
  const ctx = useContext(PanelAdminContext)

  if (!ctx) throw new Error('usePanelAdmin must be inside PanelAdminProvider')

  return ctx
}

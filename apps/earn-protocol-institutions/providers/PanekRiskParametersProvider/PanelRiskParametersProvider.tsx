'use client'
import { createContext, useContext, useReducer } from 'react'
import { UiSimpleFlowSteps, type UiTransactionStatuses } from '@summerfi/app-types'

import { type MarketRiskParameters } from '@/features/panels/vaults/components/PanelRiskParameters/market-risk-parameters-table/types'
import { type VaultRiskParameters } from '@/features/panels/vaults/components/PanelRiskParameters/vault-risk-parameters-table/types'

export type PanelRiskParametersState = {
  step: UiSimpleFlowSteps
  txStatus: UiTransactionStatuses | undefined
  vaultRiskItems: VaultRiskParameters[]
  marketRiskItems: MarketRiskParameters[]
}

export type PanelRiskParametersAction =
  | { type: 'edit-vault-risk-item'; payload: VaultRiskParameters }
  | { type: 'edit-market-risk-item'; payload: MarketRiskParameters }
  | { type: 'update-step'; payload: UiSimpleFlowSteps }
  | { type: 'update-tx-status'; payload: UiTransactionStatuses | undefined }
  | { type: 'partial-reset'; payload?: Partial<PanelRiskParametersState> }
  | { type: 'reset' }

const initialState: PanelRiskParametersState = {
  step: UiSimpleFlowSteps.INIT,
  txStatus: undefined,
  vaultRiskItems: [],
  marketRiskItems: [],
}

const reducer = (
  state: PanelRiskParametersState,
  action: PanelRiskParametersAction,
): PanelRiskParametersState => {
  switch (action.type) {
    case 'edit-vault-risk-item':
      return {
        ...state,
        vaultRiskItems: [
          ...state.vaultRiskItems.filter((item) => item.id !== action.payload.id),
          action.payload,
        ],
      }
    case 'edit-market-risk-item':
      return {
        ...state,
        marketRiskItems: [
          ...state.marketRiskItems.filter((item) => item.id !== action.payload.id),
          action.payload,
        ],
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

const PanelRiskParameterContext = createContext<{
  state: PanelRiskParametersState
  dispatch: React.Dispatch<PanelRiskParametersAction>
} | null>(null)

export function PanelRiskParametersProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <PanelRiskParameterContext.Provider value={{ state, dispatch }}>
      {children}
    </PanelRiskParameterContext.Provider>
  )
}

export function usePanelRiskParameters() {
  const ctx = useContext(PanelRiskParameterContext)

  if (!ctx) throw new Error('usePanelRiskParameter must be inside PanelRiskParameterProvider')

  return ctx
}

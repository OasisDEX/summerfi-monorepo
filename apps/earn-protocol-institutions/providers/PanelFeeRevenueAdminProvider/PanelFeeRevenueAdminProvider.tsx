'use client'
import { createContext, type Dispatch, useContext, useReducer } from 'react'
import { UiSimpleFlowSteps, type UiTransactionStatuses } from '@summerfi/app-types'

import {
  type InstitutionVaultFeeRevenueItem,
  type InstitutionVaultThirdPartyCost,
} from '@/types/institution-data'

export type PanelFeeRevenueAdminState = {
  step: UiSimpleFlowSteps
  txStatus: UiTransactionStatuses | undefined
  thirdPartyCostsItems: InstitutionVaultThirdPartyCost[]
  feeRevenueItems: InstitutionVaultFeeRevenueItem[]
}

export type PanelFeeRevenueAdminAction =
  | { type: 'edit-third-party-costs-item'; payload: InstitutionVaultThirdPartyCost }
  | { type: 'edit-fee-revenue-item'; payload: InstitutionVaultFeeRevenueItem }
  | { type: 'update-step'; payload: UiSimpleFlowSteps }
  | { type: 'update-tx-status'; payload: UiTransactionStatuses | undefined }
  | { type: 'partial-reset'; payload?: Partial<PanelFeeRevenueAdminState> }
  | { type: 'reset' }

const initialState: PanelFeeRevenueAdminState = {
  step: UiSimpleFlowSteps.INIT,
  txStatus: undefined,
  thirdPartyCostsItems: [],
  feeRevenueItems: [],
}

const reducer = (
  state: PanelFeeRevenueAdminState,
  action: PanelFeeRevenueAdminAction,
): PanelFeeRevenueAdminState => {
  switch (action.type) {
    case 'edit-third-party-costs-item':
      return {
        ...state,
        thirdPartyCostsItems: [
          ...state.thirdPartyCostsItems.filter((item) => item.type !== action.payload.type),
          action.payload,
        ],
      }
    case 'edit-fee-revenue-item':
      return {
        ...state,
        feeRevenueItems: [
          ...state.feeRevenueItems.filter((item) => item.name !== action.payload.name),
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

const PanelFeeRevenueAdminContext = createContext<{
  state: PanelFeeRevenueAdminState
  dispatch: Dispatch<PanelFeeRevenueAdminAction>
} | null>(null)

export function PanelFeeRevenueAdminProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <PanelFeeRevenueAdminContext.Provider value={{ state, dispatch }}>
      {children}
    </PanelFeeRevenueAdminContext.Provider>
  )
}

export function usePanelFeeRevenueAdmin() {
  const ctx = useContext(PanelFeeRevenueAdminContext)

  if (!ctx) throw new Error('usePanelFeeRevenueAdmin must be inside PanelFeeRevenueAdminProvider')

  return ctx
}

import { type ReactNode } from 'react'

export type ActivityTableColumns = 'when' | 'type' | 'activity'

export enum InstitutionVaultActivityType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  REBALANCE = 'rebalance',
  RISK_CHANGE = 'risk_change',
  ROLE_CHANGE = 'role_change',
}

export type InstitutionVaultActivityItem = {
  when: number
  type: InstitutionVaultActivityType
  message: ReactNode
}

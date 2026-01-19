import { type ReactNode } from 'react'
import { type TableRow } from '@summerfi/app-earn-ui'
import { type SDKVaultishType } from '@summerfi/app-types'

import { type GetVaultActivityLogByTimestampFromQuery } from '@/graphql/clients/vault-history/client'

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
  details?: ReactNode
}

export type InstitutionVaultActivityTableRow = TableRow<ActivityTableColumns> & {
  timestamp: number
  monthLabel: string
}

export type ActivityLogData = {
  vault: GetVaultActivityLogByTimestampFromQuery['vault']
  curationEvents: GetVaultActivityLogByTimestampFromQuery['curationEvents']
  roleEvents: GetVaultActivityLogByTimestampFromQuery['roleEvents']
}

export type PanelActivityProps = {
  activityLogBaseDataRaw: ActivityLogData
  vault: SDKVaultishType
  institutionName: string
}

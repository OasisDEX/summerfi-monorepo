import { type Address } from '@summerfi/app-types'
import { type GlobalRoles } from '@summerfi/sdk-client'

import {
  type getInstitutionData,
  type getUserInstitutionsList,
} from '@/app/server-handlers/institution/institution-data'

export type InstitutionVaultRoles = {
  [key in GlobalRoles]?: {
    address: Address
    lastUpdated: number
  }
}

export type InstitutionVaultThirdPartyCost = {
  type: string
  fee: number
  address: string
}

export type InstitutionVaultFeeRevenueHistoryItem = {
  monthYear: string
  income: number
  expense: number
  revenue: number
}

export type InstitutionVaultFeeRevenueItem = {
  name: string
  aumFee: number
}

export type InstitutionVaultFeeRevenueData = {
  thirdPartyCosts: InstitutionVaultThirdPartyCost[]
  feeRevenueHistory: InstitutionVaultFeeRevenueHistoryItem[]
  feeRevenue: InstitutionVaultFeeRevenueItem[]
}

export type InstitutionData = NonNullable<Awaited<ReturnType<typeof getInstitutionData>>>
export type InstitutionsList = NonNullable<Awaited<ReturnType<typeof getUserInstitutionsList>>>

export type InstitutionVaultRole = { address: Address; lastUpdated: number; role: GlobalRoles }

export type InstitutionDataBasic = {
  id: InstitutionData['id']
  displayName: InstitutionData['displayName']
}

export enum InstitutionVaultActivityType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  REBALANCE = 'rebalance',
  USER_ADDED = 'user-added',
  USER_REMOVED = 'user-removed',
}

export type InstitutionVaultActivityItem = {
  when: string
  type: InstitutionVaultActivityType
  message: string
}

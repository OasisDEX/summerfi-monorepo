import { type ContractSpecificRoleName, type GlobalRoles } from '@summerfi/sdk-client'

import {
  type getCachedInstitutionData,
  type getCachedUserInstitutionsList,
} from '@/app/server-handlers/institution/institution-data'

export type InstitutionVaultRoleType = keyof typeof ContractSpecificRoleName
export type InstitutionGlobalRoleType = keyof typeof GlobalRoles

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
  aumFee: number | null
}

export type InstitutionVaultFeeRevenueData = {
  thirdPartyCosts: InstitutionVaultThirdPartyCost[]
  feeRevenueHistory: InstitutionVaultFeeRevenueHistoryItem[]
  feeRevenue: InstitutionVaultFeeRevenueItem[]
}

export type InstitutionData = NonNullable<Awaited<ReturnType<typeof getCachedInstitutionData>>>
export type InstitutionsList = NonNullable<
  Awaited<ReturnType<typeof getCachedUserInstitutionsList>>
>

export type InstitutionVaultRole = {
  address: string
  role: InstitutionVaultRoleType
}

export type InstitutionDataBasic = {
  id: InstitutionData['id']
  displayName: InstitutionData['displayName']
}

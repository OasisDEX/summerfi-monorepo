import { type Address } from '@summerfi/app-types'
import { type GeneralRoles } from '@summerfi/sdk-client'

import {
  type getInstitutionData,
  type getUserInstitutionsList,
} from '@/app/server-handlers/institution-data'

export type InstitutionVaultRoles = {
  [key in GeneralRoles]?: {
    address: Address
    lastUpdated: number
  }
}

export type InstitutionVaultThirdPartyCost = {
  type: string
  fee: number
  address: Address
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

export type InstitutionData = NonNullable<Awaited<ReturnType<typeof getInstitutionData>>>
export type InstitutionsList = NonNullable<Awaited<ReturnType<typeof getUserInstitutionsList>>>

export type InstitutionVaultRole = [GeneralRoles, { address: Address; lastUpdated: number }]

export type InstitutionDataBasic = {
  id: InstitutionData['id']
  displayName: InstitutionData['displayName']
}

import { type Address } from '@summerfi/app-types'
import { type GeneralRoles } from '@summerfi/sdk-client'

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

export type InstitutionData = {
  id: number
  displayName: string
  name: string
}

export type InstitutionVaultRole = [GeneralRoles, { address: Address; lastUpdated: number }]

export type InstitutionDataBasic = {
  id: InstitutionData['id']
  displayName: InstitutionData['displayName']
}

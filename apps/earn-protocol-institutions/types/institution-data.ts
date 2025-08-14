import { type Address } from '@summerfi/app-types'
import { type GeneralRoles } from '@summerfi/sdk-client'

export type InstitutionVaultRoles = {
  [key in GeneralRoles]: {
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
  id: string
  institutionName: string
  totalValue: number
  numberOfVaults: number
  thirtyDayAvgApy: number
  allTimePerformance: number
  vaultsData: {
    id: string
    name: string
    asset: string
    nav: number
    aum: number
    fee: number
    inception: number
    roles: InstitutionVaultRoles
    thirdPartyCosts: InstitutionVaultThirdPartyCost[]
    feeRevenueHistory: InstitutionVaultFeeRevenueHistoryItem[]
    feeRevenue: InstitutionVaultFeeRevenueItem[]
  }[]
}

export type InstitutionVaultRole = [GeneralRoles, { address: Address; lastUpdated: number }]

export type InstitutionDataBasic = {
  id: InstitutionData['id']
  institutionName: InstitutionData['institutionName']
}

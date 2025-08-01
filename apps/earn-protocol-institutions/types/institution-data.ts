import { type Address, type InstitutionRoles } from '@summerfi/app-types'

export type InstitutionVaultRoles = {
  [key in InstitutionRoles]: {
    address: Address
    lastUpdated: number
  }
}

export type InstitutionData = {
  id: string
  institutionName: string
  totalValue: number
  numberOfVaults: number
  thirtyDayAvgApy: number
  allTimePerformance: number
  vaultsData: {
    name: string
    asset: string
    nav: number
    aum: number
    fee: number
    inception: number
    roles: InstitutionVaultRoles
  }[]
}

export type InstitutionVaultRole = [InstitutionRoles, { address: Address; lastUpdated: number }]

export type InstitutionDataBasic = {
  id: InstitutionData['id']
  institutionName: InstitutionData['institutionName']
}

import { type Address } from '@summerfi/app-types'
import { type GeneralRoles } from '@summerfi/sdk-client'

export type InstitutionVaultRoles = {
  [key in GeneralRoles]: {
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
    id: string
    name: string
    asset: string
    nav: number
    aum: number
    fee: number
    inception: number
    roles: InstitutionVaultRoles
  }[]
}

export type InstitutionVaultRole = [GeneralRoles, { address: Address; lastUpdated: number }]

export type InstitutionDataBasic = {
  id: InstitutionData['id']
  institutionName: InstitutionData['institutionName']
}

import { type Address } from '@summerfi/app-types'
import { type GeneralRoles } from '@summerfi/sdk-client'

export type InstitutionVaultRoles = {
  [key in GeneralRoles]?: {
    address: Address
    lastUpdated: number
  }
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

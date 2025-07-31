import { type InstitutionRoles } from '@summerfi/app-types'

export type RoleAdmin = {
  id: string
  role: InstitutionRoles
  address: string
  lastUpdated: number
}

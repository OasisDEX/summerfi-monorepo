import { InstiContractRoles } from '@summerfi/sdk-common'

import { type InstitutionVaultRoleType } from '@/types/institution-data'

export const vaultSpecificRolesList: {
  role: InstiContractRoles
  roleName: InstitutionVaultRoleType
}[] = [
  {
    role: InstiContractRoles.COMMANDER_ROLE,
    roleName: 'COMMANDER_ROLE',
  },
  {
    role: InstiContractRoles.CURATOR_ROLE,
    roleName: 'CURATOR_ROLE',
  },
  {
    role: InstiContractRoles.KEEPER_ROLE,
    roleName: 'KEEPER_ROLE',
  },
]

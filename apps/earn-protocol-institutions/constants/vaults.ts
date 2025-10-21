import { ContractSpecificRoleName } from '@summerfi/sdk-common'

import { type InstitutionVaultRoleType } from '@/types/institution-data'

export const vaultSpecificRolesList: {
  role: ContractSpecificRoleName
  roleName: InstitutionVaultRoleType
}[] = [
  {
    role: ContractSpecificRoleName.COMMANDER_ROLE,
    roleName: 'COMMANDER_ROLE',
  },
  {
    role: ContractSpecificRoleName.CURATOR_ROLE,
    roleName: 'CURATOR_ROLE',
  },
  {
    role: ContractSpecificRoleName.KEEPER_ROLE,
    roleName: 'KEEPER_ROLE',
  },
  {
    role: ContractSpecificRoleName.WHITELISTED_ROLE,
    roleName: 'WHITELISTED_ROLE',
  },
]

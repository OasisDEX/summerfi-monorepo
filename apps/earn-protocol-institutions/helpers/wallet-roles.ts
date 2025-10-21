import { type InstitutionVaultRoleType } from '@/types/institution-data'

const contractSpecificRoleMap: { [key in InstitutionVaultRoleType]: string } = {
  COMMANDER_ROLE: 'Commander',
  CURATOR_ROLE: 'Curator',
  KEEPER_ROLE: 'Keeper',
  WHITELISTED_ROLE: 'Whitelist',
}

/**
 * Converts an institution role to a human-readable string
 * @param role - The institution role to convert
 * @returns The human-readable string
 */
export const contractSpecificRolesToHuman = (role: InstitutionVaultRoleType): string => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return contractSpecificRoleMap[role as InstitutionVaultRoleType] ?? 'Unknown role'
}

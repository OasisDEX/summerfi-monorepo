import { type InstitutionVaultRoleType } from '@/types/institution-data'

const walletRoleMap: { [key in InstitutionVaultRoleType]: string } = {
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
export const walletRolesToHuman = (role: InstitutionVaultRoleType): string => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return walletRoleMap[role as InstitutionVaultRoleType] ?? 'Unknown role'
}

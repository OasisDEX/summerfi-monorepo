import { type InstitutionVaultRoleType } from '@/types/institution-data'

/**
 * Converts an institution role to a human-readable string
 * @param role - The institution role to convert
 * @returns The human-readable string
 */
export const walletRolesToHuman = (role: InstitutionVaultRoleType): string => {
  switch (role) {
    case 'COMMANDER_ROLE':
      return 'Commander'
    case 'CURATOR_ROLE':
      return 'Curator'
    case 'KEEPER_ROLE':
      return 'Keeper'
    case 'WHITELISTED_ROLE':
      return 'Whitelist'
    default:
      return 'Unknown role'
  }
}

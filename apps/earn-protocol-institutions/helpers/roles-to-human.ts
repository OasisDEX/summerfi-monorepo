import { InstitutionRoles } from '@summerfi/app-types'

/**
 * Converts an institution role to a human-readable string
 * @param role - The institution role to convert
 * @returns The human-readable string
 */
export const rolesToHuman = (role: InstitutionRoles): string => {
  switch (role) {
    case InstitutionRoles.GENERAL_ADMIN:
      return 'General Admin'
    case InstitutionRoles.RISK_MANAGER:
      return 'Risk Manager'
    case InstitutionRoles.MARTKET_ALLOCATOR:
      return 'Market Allocator'
    default:
      return 'Unknown role'
  }
}

import { GlobalRoles } from '@summerfi/sdk-client'

/**
 * Converts an institution role to a human-readable string
 * @param role - The institution role to convert
 * @returns The human-readable string
 */
export const walletRolesToHuman = (role: GlobalRoles): string => {
  switch (role) {
    case GlobalRoles.SUPER_KEEPER_ROLE:
      return 'Super Keeper'
    case GlobalRoles.GOVERNOR_ROLE:
      return 'Governor'
    case GlobalRoles.ADMIRALS_QUARTERS_ROLE:
      return "Admiral's Quarters"
    case GlobalRoles.DECAY_CONTROLLER_ROLE:
      return 'Decay Controller'
    default:
      return 'Unknown role'
  }
}

import { GeneralRoles } from '@summerfi/sdk-client'

/**
 * Converts an institution role to a human-readable string
 * @param role - The institution role to convert
 * @returns The human-readable string
 */
export const walletRolesToHuman = (role: GeneralRoles): string => {
  switch (role) {
    case GeneralRoles.SUPER_KEEPER_ROLE:
      return 'Super Keeper'
    case GeneralRoles.GOVERNOR_ROLE:
      return 'Governor'
    case GeneralRoles.ADMIRALS_QUARTERS_ROLE:
      return "Admiral's Quarters"
    case GeneralRoles.DECAY_CONTROLLER_ROLE:
      return 'Decay Controller'
    default:
      return 'Unknown role'
  }
}

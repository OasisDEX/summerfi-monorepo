import {
  type InstitutionGlobalRoleType,
  type InstitutionVaultRoleType,
} from '@/types/institution-data'

const contractSpecificRoleMap: { [key in InstitutionVaultRoleType]: string } = {
  COMMANDER_ROLE: 'Commander',
  CURATOR_ROLE: 'Curator',
  KEEPER_ROLE: 'Keeper',
}

const globalRoleMap: { [key in InstitutionGlobalRoleType]: string } = {
  ADMIRALS_QUARTERS_ROLE: "Admiral's Quarters",
  DECAY_CONTROLLER_ROLE: 'Decay Controller',
  GOVERNOR_ROLE: 'Governor',
  SUPER_KEEPER_ROLE: 'Super Keeper',
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

export const globalRoleToHuman = (role: InstitutionGlobalRoleType): string => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return globalRoleMap[role as InstitutionGlobalRoleType] ?? 'Unknown role'
}

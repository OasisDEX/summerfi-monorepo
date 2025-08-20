import type { HexData } from '@summerfi/sdk-common'

/**
 * @name GeneralRoles
 * @description Enum for all general protocol roles
 */
export enum GeneralRoles {
  GOVERNOR_ROLE = 'GOVERNOR_ROLE',
  SUPER_KEEPER_ROLE = 'SUPER_KEEPER_ROLE',
  DECAY_CONTROLLER_ROLE = 'DECAY_CONTROLLER_ROLE',
  ADMIRALS_QUARTERS_ROLE = 'ADMIRALS_QUARTERS_ROLE',
}

/**
 * @name GENERAL_ROLE_HASHES
 * @description Mapping of general role names to their contract hashes
 * Note: These will be populated at runtime from contract calls
 */
export const GENERAL_ROLE_HASHES: Record<GeneralRoles, HexData | null> = {
  [GeneralRoles.GOVERNOR_ROLE]: null,
  [GeneralRoles.SUPER_KEEPER_ROLE]: null,
  [GeneralRoles.DECAY_CONTROLLER_ROLE]: null,
  [GeneralRoles.ADMIRALS_QUARTERS_ROLE]: null,
}

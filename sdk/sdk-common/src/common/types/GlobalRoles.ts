import type { HexData } from './HexData'

/**
 * @name GlobalRoles
 * @description Enum for all global protocol roles
 */
export enum GlobalRoles {
  GOVERNOR_ROLE = 'GOVERNOR_ROLE',
  SUPER_KEEPER_ROLE = 'SUPER_KEEPER_ROLE',
  DECAY_CONTROLLER_ROLE = 'DECAY_CONTROLLER_ROLE',
  ADMIRALS_QUARTERS_ROLE = 'ADMIRALS_QUARTERS_ROLE',
}

/**
 * @name GLOBAL_ROLE_HASHES
 * @description Mapping of global role names to their contract hashes
 * Note: These will be populated at runtime from contract calls
 */
export const GLOBAL_ROLE_HASHES: Record<GlobalRoles, HexData | null> = {
  [GlobalRoles.GOVERNOR_ROLE]: null,
  [GlobalRoles.SUPER_KEEPER_ROLE]: null,
  [GlobalRoles.DECAY_CONTROLLER_ROLE]: null,
  [GlobalRoles.ADMIRALS_QUARTERS_ROLE]: null,
}

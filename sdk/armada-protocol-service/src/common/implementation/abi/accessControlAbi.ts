import { parseAbiItem } from 'viem'

/**
 * @description ABI definitions for access control events used in role management
 */
export const AccessControlAbi = {
  /**
   * @description Event emitted when a role is granted to an account
   */
  RoleGranted: parseAbiItem(
    'event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)',
  ),

  /**
   * @description Event emitted when a role is revoked from an account
   */
  RoleRevoked: parseAbiItem(
    'event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)',
  ),
} as const

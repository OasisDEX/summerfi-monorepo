import { encodePacked, keccak256, toBytes } from 'viem'

// Friendly labels keyed by the on-chain role-name string.
const ROLE_LABELS: { [roleName: string]: string } = {
  GOVERNOR_ROLE: 'Governor',
  SUPER_KEEPER_ROLE: 'Super Keeper',
  GUARDIAN_ROLE: 'Guardian',
  DECAY_CONTROLLER_ROLE: 'Decay Controller',
  ADMIRALS_QUARTERS_ROLE: 'Admirals Quarters',
  FOUNDATION_ROLE: 'Foundation',
  WHITELIST_MANAGER_ROLE: 'Whitelist Manager',
  WHITELIST_ROLE: 'Whitelisted',
  KEEPER_ROLE: 'Keeper',
  CURATOR_ROLE: 'Curator',
  COMMANDER_ROLE: 'Commander',
  OPERATOR_ROLE: 'Operator',
  DEFAULT_ADMIN_ROLE: 'Default Admin',
}

const GLOBAL_ROLE_NAMES = [
  'GOVERNOR_ROLE',
  'SUPER_KEEPER_ROLE',
  'GUARDIAN_ROLE',
  'DECAY_CONTROLLER_ROLE',
  'ADMIRALS_QUARTERS_ROLE',
  'FOUNDATION_ROLE',
  'WHITELIST_MANAGER_ROLE',
] as const

// Contract-specific roles: the on-chain id is keccak256(encodePacked(['string','address'], [name, target])).
const CONTRACT_ROLE_NAMES = [
  'KEEPER_ROLE',
  'CURATOR_ROLE',
  'COMMANDER_ROLE',
  'OPERATOR_ROLE',
] as const

const DEFAULT_ADMIN_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000'

// Precomputed global-role hash → role-name.
const globalHashToName = new Map<string, string>(
  GLOBAL_ROLE_NAMES.map((roleName) => [keccak256(toBytes(roleName)).toLowerCase(), roleName]),
)

globalHashToName.set(DEFAULT_ADMIN_HASH, 'DEFAULT_ADMIN_ROLE')

const isBytes32 = (value: string): boolean => /^0x[0-9a-f]{64}$/iu.test(value)
const isAddress = (value: string): value is `0x${string}` => /^0x[0-9a-f]{40}$/iu.test(value)

export type ResolvedRwaRole = {
  /** Friendly label, e.g. "Keeper" — or a truncated hash for unrecognised roles. */
  label: string
  scope: 'global' | 'contract' | 'unknown'
}

/**
 * Resolves a subgraph role `name` (a readable role string for some roles, a raw bytes32 hash for
 * others) into a friendly label. Global roles are matched against precomputed keccak hashes;
 * contract-specific roles are reversed by recomputing the hash from each candidate role-name and the
 * role's `targetContract`. Unrecognised hashes degrade to a truncated form rather than a 66-char blob.
 */
export const resolveRwaRoleLabel = (
  rawName: string,
  targetContract?: string | null,
): ResolvedRwaRole => {
  // Already a readable role-name string (e.g. the subgraph returned "GOVERNOR_ROLE").
  if (ROLE_LABELS[rawName]) {
    const scope = (CONTRACT_ROLE_NAMES as readonly string[]).includes(rawName)
      ? 'contract'
      : 'global'

    return { label: ROLE_LABELS[rawName], scope }
  }
  if (!isBytes32(rawName)) {
    return { label: rawName, scope: 'unknown' }
  }

  const lower = rawName.toLowerCase()
  const globalName = globalHashToName.get(lower)

  if (globalName) {
    return { label: ROLE_LABELS[globalName] ?? globalName, scope: 'global' }
  }
  if (targetContract && isAddress(targetContract)) {
    for (const candidateRoleName of CONTRACT_ROLE_NAMES) {
      const candidate = keccak256(
        encodePacked(['string', 'address'], [candidateRoleName, targetContract]),
      ).toLowerCase()

      if (candidate === lower) {
        return { label: ROLE_LABELS[candidateRoleName], scope: 'contract' }
      }
    }
  }

  return { label: `${rawName.slice(0, 10)}…${rawName.slice(-4)}`, scope: 'unknown' }
}

/**
 * Computes the on-chain role hash for a grantable role kind (e.g. 'GOVERNOR', 'KEEPER'). Global roles
 * hash the name directly; contract-specific roles need a `target`. Returns null when a target is
 * required but missing/invalid (used to show the hash in the grant/revoke form for verification).
 */
export const computeRwaRoleHash = (kind: string, target?: string): `0x${string}` | null => {
  const roleName = `${kind}_ROLE`

  if ((GLOBAL_ROLE_NAMES as readonly string[]).includes(roleName)) {
    return keccak256(toBytes(roleName))
  }
  if (target && isAddress(target)) {
    return keccak256(encodePacked(['string', 'address'], [roleName, target]))
  }

  return null
}

import { InstiContractRoles } from '@summerfi/sdk-common'
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

// Contract-specific roles. On chain these are `generateRole(roleName, target)` =
// keccak256(abi.encodePacked(uint8 roleName, address target)), where `roleName` is the
// `InstiContractRoles` enum index (NOT the string). The earlier string-packed scheme never matched
// any on-chain hash — see [[rwa-roles-unknown-scope]].
const CONTRACT_ROLE_ENUM: { name: string; index: InstiContractRoles }[] = [
  { name: 'CURATOR_ROLE', index: InstiContractRoles.CURATOR_ROLE },
  { name: 'KEEPER_ROLE', index: InstiContractRoles.KEEPER_ROLE },
  { name: 'COMMANDER_ROLE', index: InstiContractRoles.COMMANDER_ROLE },
  { name: 'OPERATOR_ROLE', index: InstiContractRoles.OPERATOR_ROLE },
]

const CONTRACT_ROLE_NAMES = CONTRACT_ROLE_ENUM.map((r) => r.name)

const DEFAULT_ADMIN_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000'

// Precomputed global-role hash → role-name.
const globalHashToName = new Map<string, string>(
  GLOBAL_ROLE_NAMES.map((roleName) => [keccak256(toBytes(roleName)).toLowerCase(), roleName]),
)

globalHashToName.set(DEFAULT_ADMIN_HASH, 'DEFAULT_ADMIN_ROLE')

const isBytes32 = (value: string): boolean => /^0x[0-9a-f]{64}$/iu.test(value)
const isAddress = (value: string): value is `0x${string}` => /^0x[0-9a-f]{40}$/iu.test(value)
const isZeroAddress = (value: string): boolean => /^0x0+$/u.test(value)

export type ContractRoleHashMap = Map<string, { roleName: string; target: string }>

export type ResolvedRwaRole = {
  /** Friendly label, e.g. "Keeper" — or a truncated hash for unrecognised roles. */
  label: string
  scope: 'global' | 'contract' | 'unknown'
  /** For contract-specific roles, the target the role applies to (fleet/ark/account), when known. */
  target?: string
}

/**
 * Builds a reverse lookup (roleHash → role-name + target) for contract-specific roles by hashing each
 * `(InstiContractRoles enum, candidate target)` pair the way the on-chain `generateRole(uint8,address)`
 * does. The v2 subgraph only decodes contract roles whose target it recognises as a FleetCommander, so
 * roles targeting arks (Commander) or arbitrary accounts arrive as raw bytes32 names with a zero
 * `targetContract`. Feeding the vault, its arks and every address seen in the role set as candidate
 * targets lets {@link resolveRwaRoleLabel} reverse those raw hashes instead of showing them as Unknown.
 */
export const buildContractRoleHashMap = (
  targets: readonly (string | null | undefined)[],
): ContractRoleHashMap => {
  const map: ContractRoleHashMap = new Map()
  const seen = new Set<string>()

  targets.forEach((target) => {
    if (!target || !isAddress(target) || isZeroAddress(target)) return
    const lower = target.toLowerCase()

    if (seen.has(lower)) return
    seen.add(lower)

    CONTRACT_ROLE_ENUM.forEach(({ name: roleName, index }) => {
      const hash = keccak256(encodePacked(['uint8', 'address'], [index, target])).toLowerCase()

      if (!map.has(hash)) map.set(hash, { roleName, target })
    })
  })

  return map
}

/**
 * Resolves a subgraph role `name` (a readable role string for some roles, a raw bytes32 hash for
 * others) into a friendly label. Global roles are matched against precomputed keccak hashes;
 * contract-specific roles whose name arrives as a raw hash are reversed via `contractRoleMap` (built
 * from the vault, its arks and the addresses in the role set — see {@link buildContractRoleHashMap}).
 * Unrecognised hashes degrade to a truncated form rather than a 66-char blob.
 */
export const resolveRwaRoleLabel = (
  rawName: string,
  targetContract?: string | null,
  contractRoleMap?: ContractRoleHashMap,
): ResolvedRwaRole => {
  // Already a readable role-name string (e.g. the subgraph returned "GOVERNOR_ROLE").
  if (ROLE_LABELS[rawName]) {
    const isContractRole = CONTRACT_ROLE_NAMES.includes(rawName)

    return {
      label: ROLE_LABELS[rawName],
      scope: isContractRole ? 'contract' : 'global',
      target: isContractRole ? (targetContract ?? undefined) : undefined,
    }
  }
  if (!isBytes32(rawName)) {
    return { label: rawName, scope: 'unknown' }
  }

  const lower = rawName.toLowerCase()
  const globalName = globalHashToName.get(lower)

  if (globalName) {
    return { label: ROLE_LABELS[globalName] ?? globalName, scope: 'global' }
  }

  const contractMatch = contractRoleMap?.get(lower)

  if (contractMatch) {
    return {
      label: ROLE_LABELS[contractMatch.roleName] ?? contractMatch.roleName,
      scope: 'contract',
      target: contractMatch.target,
    }
  }

  return { label: `${rawName.slice(0, 10)}…${rawName.slice(-4)}`, scope: 'unknown' }
}

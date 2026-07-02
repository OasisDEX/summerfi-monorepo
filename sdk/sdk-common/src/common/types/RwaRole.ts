import { z } from 'zod'
import { type AddressValue, isAddressValue } from './AddressValue'

/**
 * A grantable / revocable role on an institution's ProtocolAccessManager(V2). Global roles
 * carry no target; contract-specific roles (Keeper/Curator/Operator on a Fleet, Commander
 * on an Ark) target a specific contract. Mirrors the on-chain typed role wrappers
 * (`grantGovernorRole`, `grantKeeperRole`, …) — the contract derives the role hash, so no
 * hash is passed. `ProtocolAccessManager` disables OZ's generic `grantRole`, which is why
 * these map to the typed wrappers rather than a single (role-hash, account) call.
 */
export type RwaRole =
  | { kind: 'GOVERNOR' }
  | { kind: 'SUPER_KEEPER' }
  | { kind: 'GUARDIAN' }
  | { kind: 'DECAY_CONTROLLER' }
  | { kind: 'ADMIRALS_QUARTERS' }
  | { kind: 'FOUNDATION' }
  | { kind: 'WHITELIST_MANAGER' }
  | { kind: 'KEEPER'; target: AddressValue }
  | { kind: 'CURATOR'; target: AddressValue }
  | { kind: 'COMMANDER'; target: AddressValue }
  | { kind: 'OPERATOR'; target: AddressValue }

// Generic over the literal `K` so each `z.literal` keeps its specific kind (a non-generic
// `kind: RwaRole['kind']` param would widen every literal to the full union and break narrowing).
const targetlessRole = <K extends RwaRole['kind']>(kind: K) => z.object({ kind: z.literal(kind) })
const targetedRole = <K extends RwaRole['kind']>(kind: K) =>
  z.object({ kind: z.literal(kind), target: z.custom<AddressValue>(isAddressValue) })

/**
 * Zod schema for {@link RwaRole}, used to validate the role descriptor at the tRPC boundary.
 */
export const RwaRoleSchema = z.union([
  targetlessRole('GOVERNOR'),
  targetlessRole('SUPER_KEEPER'),
  targetlessRole('GUARDIAN'),
  targetlessRole('DECAY_CONTROLLER'),
  targetlessRole('ADMIRALS_QUARTERS'),
  targetlessRole('FOUNDATION'),
  targetlessRole('WHITELIST_MANAGER'),
  targetedRole('KEEPER'),
  targetedRole('CURATOR'),
  targetedRole('COMMANDER'),
  targetedRole('OPERATOR'),
])

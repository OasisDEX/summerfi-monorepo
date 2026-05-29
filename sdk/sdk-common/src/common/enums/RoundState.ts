import { z } from 'zod'

/**
 * @enum RoundState
 * @description Represents the lifecycle state of a RoundsVault round.
 *              Mirrors the on-chain `RoundState` enum in RoundsVaultBase.sol.
 */
export enum RoundState {
  /** EVM default — the round has never been opened */
  NotOpened = 0,
  /** Round is accepting deposits and current-round redemptions */
  Opened = 1,
  /** Round has been closed by the Keeper, pending settlement */
  InSettlement = 2,
  /** Settlement complete — exchange-asset redemptions are now available */
  Settled = 3,
}

export const RoundStateSchema = z.nativeEnum(RoundState)

/**
 * Type guard for RoundState
 */
export function isRoundState(maybeRoundState: unknown): maybeRoundState is RoundState {
  return RoundStateSchema.safeParse(maybeRoundState).success
}

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: RoundState = {} as z.infer<typeof RoundStateSchema>

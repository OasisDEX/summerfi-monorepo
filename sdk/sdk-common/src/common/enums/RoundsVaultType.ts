import { z } from 'zod'

/**
 * @enum RoundsVaultType
 * @description Distinguishes between the two RoundsVault flavors.
 *              Input vaults accept the Fleet's underlying asset (e.g. USDC) and issue Fleet shares
 *              on settlement. Output vaults accept Fleet shares and return the underlying asset.
 */
export enum RoundsVaultType {
  Input = 'Input',
  Output = 'Output',
}

/** Zod schema validating a value against the {@link RoundsVaultType} enum. */
export const RoundsVaultTypeSchema = z.nativeEnum(RoundsVaultType)

/**
 * Type guard that checks whether a value is a valid {@link RoundsVaultType}.
 *
 * @param maybeRoundsVaultType - The value to test.
 * @returns `true` if the value is a {@link RoundsVaultType}, narrowing its type.
 */
export function isRoundsVaultType(
  maybeRoundsVaultType: unknown,
): maybeRoundsVaultType is RoundsVaultType {
  return RoundsVaultTypeSchema.safeParse(maybeRoundsVaultType).success
}

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const __schemaChecker: RoundsVaultType = {} as z.infer<typeof RoundsVaultTypeSchema>

import { z } from 'zod'

/**
 * @name ArmadaMigrationType
 * @description Enumerates the names of the protocols that are migratable by the Armada
 */
export enum ArmadaMigrationType {
  AaveV3 = 'AaveV3',
  Compound = 'Compound',
  Morpho = 'Morpho',
}

/**
 * @description Zod schema for ProtocolName
 */
export const ArmadaMigrationTypeSchema = z.nativeEnum(ArmadaMigrationType)

/**
 * @description Type guard for ProtocolName
 * @param maybeArmadaMigrationType Object to be checked
 * @returns true if the object is a ProtocolName
 */
export function isArmadaMigrationType(
  maybeArmadaMigrationType: unknown,
): maybeArmadaMigrationType is ArmadaMigrationType {
  return ArmadaMigrationTypeSchema.safeParse(maybeArmadaMigrationType).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
const __schemaChecker: ArmadaMigrationType = {} as z.infer<typeof ArmadaMigrationTypeSchema>

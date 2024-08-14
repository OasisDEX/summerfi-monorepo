import { z } from 'zod'

/**
 * Enum for the different types of subgraph providers.
 */
export enum SubgraphProviderType {
  /** Pre-built list of subgraphs */
  Armada = 'Armada',
}

/**
 * Zod schema for the SubgraphProviderType enum.
 */
export const SubgraphProviderTypeSchema = z.nativeEnum(SubgraphProviderType)

/**
 * Type guard for SubgraphProviderType
 * @param maybeSubgraphProviderType Object to be checked
 * @returns true if the object is a SubgraphProviderType
 */
export function isSubgraphProviderType(
  maybeSubgraphProviderType: unknown,
): maybeSubgraphProviderType is SubgraphProviderType {
  return SubgraphProviderTypeSchema.safeParse(maybeSubgraphProviderType).success
}

/**
 * Checker to make sure that the schema is aligned with the interface
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
const __schemaChecker: SubgraphProviderType = {} as z.infer<typeof SubgraphProviderTypeSchema>

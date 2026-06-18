/**
 * Institutional deployment-config version for RWA (selects the RWA / institutions-v2 subgraph).
 *
 * RWA (rounds-based) vault calls must be served by an institutional SDK (`makeInstiSdk`) so the
 * request carries the `Client-Id` and `Insti-Version` headers — without them the SDK server
 * defaults `Insti-Version` to 'v1' and resolves the wrong deployment/subgraph. Shared by every RWA
 * institution; the per-institution `Client-Id` is derived from each vault's `vaultInstitutionId`
 * fleet-config field (see `getVaultRwaClientId` / `getRwaClientIdsForChain`).
 */
export const RWA_INSTI_VERSION = 'v2' as const

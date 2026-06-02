/**
 * Institution client id used to resolve the RWA deployment config + subgraph.
 *
 * RWA (rounds-based) vault calls must be served by an institutional SDK (`makeInstiSdk`) so the
 * request carries the `Client-Id` and `Insti-Version` headers — without them the SDK server
 * defaults `Insti-Version` to 'v1' and resolves the wrong deployment/subgraph.
 *
 * NOTE: placeholder value for now — to be replaced with the real institution id when available.
 */
export const RWA_CLIENT_ID = 'ExtDemoCorp_v2'

/** Institutional deployment-config version for RWA (selects the RWA / institutions-v2 subgraph). */
export const RWA_INSTI_VERSION = 'v2' as const

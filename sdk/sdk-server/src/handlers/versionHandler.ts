import { publicProcedure } from '../SDKTRPC'

/**
 * Health / version endpoint. Confirms the API is alive and reports which `sdk-client` version is
 * serving the request.
 *
 * The gateway routes each request by **major only** (`/sdk/trpc/v<major>/…`, or legacy
 * `/api/sdk/v<major>/…`), so the URL identifies the route's major while `SDK_DEPLOYED_VERSIONS_MAP`
 * (read from the `ConfigurationProvider`) holds the full `X.Y.Z` for each major. This combines them:
 * it parses the major from the request path (`ctx.callUrl`) and resolves it against the map to return
 * the exact version this route serves — alongside the full map for reference.
 *
 * `version`/`major` are `null` when the caller bypasses HTTP routing (e.g. a server-side
 * `createCaller`) or the map can't be parsed; `raw` always carries the unparsed config value.
 */
export const versionHandler = publicProcedure.query(async ({ ctx }) => {
  const raw = ctx.configProvider.getConfigurationItem({ name: 'SDK_DEPLOYED_VERSIONS_MAP' })

  let deployedVersions: Record<string, string> = {}
  try {
    deployedVersions = raw ? (JSON.parse(raw) as Record<string, string>) : {}
  } catch {
    // Leave `deployedVersions` empty when the config value can't be parsed; `raw` still carries it.
  }

  // The route major is the `/v<N>/` segment of the path (works for both `/sdk/trpc/v2/…` and the
  // legacy `/api/sdk/v2/…` mount, and regardless of any stage prefix).
  const major = ctx.callUrl.match(/\/v(\d+)\//)?.[1]
  const majorKey = major !== undefined ? `v${major}` : null
  const version = majorKey ? (deployedVersions[majorKey] ?? null) : null

  return { version, major: majorKey, deployedVersions, raw }
})

export const INSTITUTIONS_CACHE_TAGS = {
  CONFIG: 'config',
  VAULT_DETAILS: 'vault-details',
  // React Query key namespaces for the client-deferred (lazy/scroll) data units. They double as
  // refresh tags so the same tag-based invalidation works for both server caches and query keys.
  INSTITUTION_TVL_CHART: 'institution-tvl-chart',
  VAULT_OVERVIEW_CHARTS: 'vault-overview-charts',
  VAULT_ACTIVITY_LOG: 'vault-activity-log',
  VAULT_USER_ADMIN: 'vault-user-admin',
  VAULT_EXPOSURE: 'vault-exposure',
  VAULT_RISK_PARAMETERS: 'vault-risk-parameters',
  VAULT_ROLE_ADMIN: 'vault-role-admin',
  INSTITUTION_INTERNAL_USERS: 'institution-internal-users',
}

export const INSTITUTIONS_CACHE_TIMES = {
  CONFIG: 60,
  ALWAYS_FRESH: 0,
  VAULT_DETAILS: 300,
  // Vault NAV/TVL history feeding the charts. Cached via an in-process hard-TTL map (NOT
  // unstable_cache) so a lapsed entry triggers a blocking refetch instead of serving a stale
  // snapshot — stale-while-revalidate left the chart's trailing buckets unfilled (drops to 0).
  VAULT_PERFORMANCE_DATA: 300,
}

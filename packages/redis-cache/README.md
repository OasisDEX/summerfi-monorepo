# @summerfi/redis-cache

Thin wrapper around the `redis` v4 client that returns a `DistributedCache` instance (from
`@summerfi/abstractions`). It connects with TLS enabled, prefixes every cache key with the
configured `stage` value (e.g. `production:some-key`), and applies a uniform TTL (in seconds) to
every `set` call.

## Key exports

- `getRedisInstance(config: RedisConfig, logger: Logger): Promise<DistributedCache>` — the single
  exported function; connects to Redis and returns a `{ get, set }` object.
- `RedisConfig` — exported interface: `url`, `ttlInSeconds`, `stage` (required); `username`,
  `password`, `database` (optional).

## Commands

| Task       | Command         |
| ---------- | --------------- |
| Build      | `pnpm build`    |
| Watch      | `pnpm dev`      |
| Test       | `pnpm test`     |
| Lint       | `pnpm lint`     |
| Lint + fix | `pnpm lint:fix` |

## Cross-package connections

**Consumes**

- `@summerfi/abstractions` — provides the `DistributedCache` and `Logger` interfaces that this
  package implements/accepts.
- `redis` (npm, ^4.6.13) — underlying Redis client.

**Consumed by**

- `summerfi-api/get-apy-function`
- `summerfi-api/get-rates-function`

**Gotchas**

- The package has no `format:fix` script; run linting via `pnpm lint:fix`.
- TLS is hardcoded to `true`; connections to non-TLS Redis instances will fail.
- Key isolation between environments relies entirely on the `stage` field in `RedisConfig` — callers
  must pass the correct value (e.g. `"production"`, `"staging"`).
- No compiled output is committed; run `pnpm build` before consuming from another package locally.

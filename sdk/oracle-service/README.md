# @summerfi/oracle-service

Server-side implementation of the oracle layer for the Summer.fi SDK. This package provides
`OracleManager` and `OracleManagerFactory` — the concrete classes that satisfy the `IOracleManager`
interface from `@summerfi/oracle-common` — backed by two providers: a 1inch spot-price API provider
(`OneInchOracleProvider`) and a CoinGecko provider (`CoingeckoOracleProvider`). `OracleManager`
extends `ManagerWithProvidersBase` from `@summerfi/sdk-server-common`, which handles best-provider
selection per chain; the common/service split keeps interfaces in `oracle-common` and runtime logic
here.

## Key exports

| Export                                                | Description                                                                                                                         |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `OracleManager`                                       | Implements `IOracleManager`; delegates `getSpotPrice` / `getSpotPrices` to the best available provider for the requested chain      |
| `OracleManagerFactory`                                | Static factory — call `OracleManagerFactory.newOracleManager({ configProvider })` to get a ready instance wired with both providers |
| `OneInchOracleProvider`                               | Fetches spot prices from the 1inch Price API v1.1                                                                                   |
| `CoingeckoOracleProvider`                             | Fetches spot prices from CoinGecko                                                                                                  |
| `OracleManagerProviderConfig`, `OracleProviderConfig` | Supporting config types                                                                                                             |

## Commands

```bash
pnpm build      # tsc -b --preserveWatchOutput tsconfig.build.json
pnpm test       # jest tests/ --passWithNoTests
pnpm e2e        # jest e2e/
pnpm watch      # tsc -w
pnpm lint       # eslint .
pnpm lint:fix   # eslint . --fix
```

## Cross-package connections

**Consumes:** `@summerfi/oracle-common` (interfaces), `@summerfi/sdk-server-common` (base
manager/provider classes), `@summerfi/sdk-common` (domain types),
`@summerfi/configuration-provider-common` (config interface). `@summerfi/configuration-provider`
is used only by the `e2e/` tests.

**Consumed by:** `@summerfi/sdk-server` (wires the factory into the server).

**Required environment variables** (read at construction time via `configProvider`; missing values
throw at startup):

| Variable                        | Used by                                                                 |
| ------------------------------- | ----------------------------------------------------------------------- |
| `ONE_INCH_API_SPOT_URL`         | `OneInchOracleProvider` — base URL for the 1inch price endpoint         |
| `ONE_INCH_API_SPOT_VERSION`     | `OneInchOracleProvider` — API version segment (e.g. `v1.1`)             |
| `ONE_INCH_API_SPOT_KEY`         | `OneInchOracleProvider` — API key                                       |
| `ONE_INCH_API_SPOT_AUTH_HEADER` | `OneInchOracleProvider` — header name for the Bearer token              |
| `ONE_INCH_API_SPOT_CHAIN_IDS`   | `OneInchOracleProvider` — comma-separated list of supported chain IDs   |
| `COINGECKO_API_URL`             | `CoingeckoOracleProvider` — base URL for the CoinGecko API              |
| `COINGECKO_API_VERSION`         | `CoingeckoOracleProvider` — API version segment (e.g. `v3`)             |
| `COINGECKO_API_KEY`             | `CoingeckoOracleProvider` — API key                                     |
| `COINGECKO_API_AUTH_HEADER`     | `CoingeckoOracleProvider` — header name for the API key                 |
| `COINGECKO_SUPPORTED_CHAIN_IDS` | `CoingeckoOracleProvider` — comma-separated list of supported chain IDs |

**Gotcha:** all ten env vars above are required — each provider throws synchronously during
construction if any of its vars are absent, so misconfiguration surfaces at server boot rather than
at the first price request.

SDK reference docs live in `gitbook/reference`.

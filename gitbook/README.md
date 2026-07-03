---
description: What the Summer.fi SDK is, how to install it, and how to create a client.
---

# SDK Overview

The Summer.fi SDK (`@summer_fi/sdk-client`) is a TypeScript client for interacting with the
Summer.fi protocol. It lets you query Armada vaults, build deposit / withdraw / vault-switch
transactions, read user positions, manage rewards, and perform intent-based swaps — all without
writing raw calldata or talking to the subgraph directly.

> Applies to `@summer_fi/sdk-client` v2.3.0

This page covers installation, creating the SDK client, and the top-level client surface. For the
generated, type-level API reference see
[`reference/@summerfi/sdk-client`](reference/@summerfi/sdk-client/README.md).

## Installation

The SDK client is a strongly typed, documented library for talking to our RPC-based API — the
recommended path to the best developer experience. A JavaScript/TypeScript client is currently the
only one available.

### Prerequisites

- Node.js (version 18 or higher) or a compatible runtime.
- npm or pnpm. Yarn is not supported (peer dependencies are not auto-installed on any Yarn version),
  but can be worked around.
- An npm access token — the packages are private (see below).

### Request access to the private packages

Our npm packages are private and require an npm Granular Access Token to install. See npm's
[About access tokens](https://docs.npmjs.com/about-access-tokens) for background.

Request an integrator access token by email:
[integrations@summer.fi](mailto:integrations@summer.fi).

### Set the token in your project's `.npmrc`

Because the package is private, add an `.npmrc` file in your project root (next to `package.json`).

For local development, paste your token directly:

```ini
//registry.npmjs.org/:_authToken=replace_with_your_token
```

For CI, reference an environment variable instead (`export NPM_TOKEN=your_token`):

```ini
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```

### Install the package

`@summer_fi/sdk-client` provides the API client for communicating with our API.

```bash
npm install @summer_fi/sdk-client
# or
pnpm add @summer_fi/sdk-client
```

> As of v2.0.0 the former `@summerfi/sdk-common` package was deprecated and merged into
> `@summerfi/sdk-client`. It is no longer needed for new projects. If you are migrating from v1.x,
> update all imports to `@summer_fi/sdk-client` and remove `@summerfi/sdk-common` from your
> dependencies.

## Creating the SDK client

Create a single shared SDK instance with
[`makeSDK`](reference/@summerfi/sdk-client/functions/makeSDK.md) and reuse it across your app.

```typescript
// ./sdk.ts — a reusable, shared SDK instance
import { makeSDK } from '@summer_fi/sdk-client'

export const sdk = makeSDK({
  apiDomainUrl: `https://summer.fi`,
  logging: process.env.NODE_ENV === 'development',
})
```

`makeSDK` accepts either an `apiDomainUrl` (recommended — it derives the versioned API URL and
routing automatically) or a direct `apiURL`, plus an optional `logging` flag. It returns an
[`SDKManager`](reference/@summerfi/sdk-client/classes/SDKManager.md) instance.

## The client surface

The SDK manager exposes the following top-level managers:

| Property          | Purpose                                                                        |
| ----------------- | ------------------------------------------------------------------------------ |
| `sdk.armada`      | Armada vault flows: vault info, deposits, withdrawals, positions, and rewards. |
| `sdk.tokens`      | Token lookup by symbol or address on a given chain.                            |
| `sdk.oracle`      | Spot price lookups for tokens.                                                 |
| `sdk.chains`      | Chain metadata and per-chain token access.                                     |
| `sdk.intentSwaps` | Intent-based (CoW Protocol) swaps.                                             |

Most user-facing vault operations live under `sdk.armada.users`, for example:

```typescript
const vaults = await sdk.armada.users.getVaultInfoList({ chainId: ChainIds.Base })
```

### Tokens

Resolve token entities from a curated list of supported tokens, by symbol or address.

```typescript
const chainId = ChainIds.Base

const usdc = await sdk.tokens.getTokenBySymbol({ symbol: 'USDC', chainId })
const usdcByAddress = await sdk.tokens.getTokenByAddress({
  addressValue: '0x...',
  chainId,
})
```

### Token prices

Read a spot price for a base token, denominated in another token or in fiat.

```typescript
import { FiatCurrency } from '@summer_fi/sdk-client'

const baseToken = await sdk.tokens.getTokenBySymbol({ symbol: 'ETH', chainId: ChainIds.Base })
const denomination = await sdk.tokens.getTokenBySymbol({ symbol: 'USDC', chainId: ChainIds.Base })
// or denominate in fiat: const denomination = FiatCurrency.USD

const priceInfo = await sdk.oracle.getSpotPrice({ baseToken, denomination })
const price = priceInfo.price
```

## Supported chains

The SDK exposes chain IDs through the
[`ChainIds`](reference/@summerfi/sdk-client/variables/ChainIds.md) constant:

```typescript
const ChainIds = {
  Mainnet: 1,
  Optimism: 10,
  Base: 8453,
  ArbitrumOne: 42161,
  Sonic: 146,
} as const
```

## Next steps

- [Quickstart](quickstart.md) — make a client, fetch a vault, build a deposit.
- [Vaults and rates](guides/vaults-and-rates.md)
- [Deposits](guides/deposits.md)
- [Positions](guides/positions.md)
- [Rewards](guides/rewards.md)
- [Intent swaps](guides/intent-swaps.md)
- [Changelog](changelog.md)

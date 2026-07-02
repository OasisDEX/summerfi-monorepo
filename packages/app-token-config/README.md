# @summerfi/app-token-config

`@summerfi/app-token-config` is a hand-maintained registry of every token recognised by the
Summer.fi frontend. It exports a single typed array — `tokenConfigs` — that maps token symbols to
display names and icon identifiers, optionally flagging a `rootToken` for derivative assets (e.g.
`WSTETH → 'ETH'`, `WBTC → 'BTC'`). The list is the authoritative source for which tokens the UI can
render with a proper icon.

## Key exports

| Export         | Type            | Description                                                     |
| -------------- | --------------- | --------------------------------------------------------------- |
| `tokenConfigs` | `TokenConfig[]` | Array of all registered tokens; the only export of the package. |

`TokenConfig` (from `@summerfi/app-types`) has the shape:

```ts
interface TokenConfig {
  symbol: TokenSymbolsList
  name: string
  iconName: IconNamesList
  rootToken?: string // e.g. 'ETH', 'BTC', 'DAI'
  iconUnavailable?: boolean
}
```

## Build / test / dev commands

The `package.json` defines **no scripts**. There is no build step — `main` points directly to
`index.ts` and consumers import it as a workspace dependency at source.

## Cross-package connections

**Consumes:**

- `@summerfi/app-types` — provides the `TokenConfig` interface (and the `TokenSymbolsList` /
  `IconNamesList` union types that constrain each entry).

**Consumed by:**

- `@summerfi/app-earn-ui` — imports `tokenConfigs` via
  `packages/app-earn-ui/src/tokens/helpers/index.ts` and `vite.config.ts`.

**Gotchas:**

- The list is entirely hand-maintained; there is no codegen. Every new token requires a manual entry
  here.
- `iconName` must match a valid `IconNamesList` value from `@summerfi/app-types`. Tokens with no
  matching icon use `'not_supported_icon'` (or set `iconUnavailable: true`).
- `rootToken` is a plain string, not validated against the symbol list — keep it consistent with
  existing conventions (`'ETH'`, `'BTC'`, `'DAI'`, `'USD'`).
- Adding a token here does **not** automatically make it available on-chain or in routing; it only
  enables the UI to display it with the correct name and icon.

## Adding a new token

Edit `index.ts` and append an entry to the `tokenConfigs` array:

```ts
{
  symbol: 'NEWSYM',
  name: 'New Token Name',
  iconName: 'newsym_circle_color',
  // rootToken: 'ETH',  // only for derivatives
}
```

No build or codegen step is required after editing this file.

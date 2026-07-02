# @summerfi/sdk-client-react

React bindings for the Summer.fi SDK. Wraps `@summerfi/sdk-client` (which provides `makeSDK`,
`makeAdminSDK`, and `makeInstiSdk`) in a React context/hook layer so that any React app can access
SDK functionality without managing SDK instances directly. The package sits at the boundary between
the common/service SDK packages and the consuming React applications.

## Key exports

| Export                                                   | Kind           | Description                                                                                                                                                                                                                         |
| -------------------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SDKProvider`                                            | Component      | Top-level provider; accepts a single `apiURL` prop and makes it available to all descendants.                                                                                                                                       |
| `SDKContextProvider` / `useSDKContext`                   | Context / hook | Lower-level access to the raw context value (`apiURL`). Throws if used outside an initialised provider.                                                                                                                             |
| `useSDK`                                                 | Hook           | Creates SDK client instances from `apiURL` and exposes per-feature handler functions (deposit/withdraw TXs, cross-chain, staking V2, rewards, vault info, RWA, intent-swaps, bridge, migrate, etc.) assembled from `src/handlers/`. |
| `SdkClient`, `SdkManagerClient`, `SdkInstiManagerClient` | Types          | Re-exported from `useSDK` for consumer typing.                                                                                                                                                                                      |

## Scripts

```
pnpm build      # tsc -b --preserveWatchOutput -v tsconfig.build.json
pnpm tsc        # plain type-check
pnpm watch      # tsc -w
pnpm test       # jest --passWithNoTests
pnpm testw      # jest --watch
pnpm lint       # eslint .
pnpm lint:fix   # eslint . --fix
```

## Cross-package connections

**Consumes:** `@summerfi/sdk-client` (SDK factory functions), `@summerfi/sdk-common` (shared types).
React 19 is a peer dependency.

**Consumed by:** React applications outside the `sdk/` directory (nothing inside `sdk/` depends on
this package).

**Gotchas:**

- `SDKProvider` accepts only `apiURL`; any new configuration the SDK requires must be threaded
  through `SDKContextType` and `SDKProvider` manually.
- `useSDK` exposes handlers by importing each file in `src/handlers/` individually. When new router
  procedures are added to `sdk-client`, a corresponding handler file must be created and wired into
  `useSDK` by hand — there is no codegen step.

SDK reference docs live in `gitbook/reference`.

[![codecov](https://codecov.io/gh/OasisDEX/summerfi-monorepo/graph/badge.svg?token=QL882Y3C8G)](https://codecov.io/gh/OasisDEX/summerfi-monorepo)

# Summerfi monorepo

## Structure

### Apps

- `earn-protocol`: Summer.fi Earn Protocol (main app)
- `earn-protocol-institutions`: Institutional portal
- `earn-protocol-landing-page`: Static landing page
- `summerfi-api`: Summerfi API (Lambda functions via SST)

### Packages

- `sdk`: Summerfi SDK
- `app-earn-ui`: Shared UI components for earn apps
- `app-types`: Shared TypeScript types
- `app-utils`: Shared utilities
- `app-risk`: Risk assessment module
- `app-tos`: Terms of Service module
- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and
  `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

## Commands

### Install deps

```shell
pnpm i
```

### Build

To build all apps and packages, run the following command:

```shell
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```shell
pnpm dev
```

## Submodules

To initialize submodules use:

`git submodule update armada-protocol/contracts`

If you want to restore submodules after folder is removed or something broke, delete the submodule
folder and run following script: `./bin/restore-git-submodule`.

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)


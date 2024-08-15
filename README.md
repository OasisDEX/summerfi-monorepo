# Summerfi monorepo

## Structure

### Apps

- `summerfi-api`: Summerfi API

### Packages

- `sdk`: Summerfi SDK
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

`git submodule update earn-protocol/contracts`

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

# Summer.fi Monorepo

This is a monorepo for the Summer.fi project.
In the endgame, it should contain all the code for the frontend application, serverless functions, and smart contracts. 
It should also contain the documentations and infrastructure code.

### Current Structure

- `apps/summerfi-api`: An API definition using SST for infrastructure and serverless functions.
- `pacakges`: a folder with non executables 
  - `eslint-config`: a shared eslint config for all the packages
  - `typescript-config`: a shared typescript config for all the packages

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).


## Still to do
- [ ] Add portfolio's functions to SST. Right now, there are only `triggers` functions there.
- [ ] Add pipelines for staging and production to run the stacks from SST. Check the [docs](https://docs.sst.dev/going-to-production#deploy-from-github-actions)
  - The pipelines should check the `turbo cache` and deploy only if there are changes
- [ ] Protect the `main` branch. Add some workflow to marge to `main` only from PRs with two approvals.
- [ ] Add turbo command to run tests from all packages. Right now, there are some issues with `jest` configs.
- [ ] Add turbo CLI command to add new package, app or function
## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)

# Hardhat Helpers

The hardhat helpers library provides a common configuration and utils for all hardhat projects in
the monorepo. This library is used by the `contracts/core` and the `contracts/hedging-vault`
workspaces.

The idea is that the hardhat workspace will import the main hardhat config in
[`src/hardhat/hardhat.default.ts`](src/hardhat/hardhat.default.ts) and extend or overwrite to fit
the needs of the project.

An example can be seen in the `contracts/core` workspace
[hardhat.config.ts](../../contracts/core/hardhat.config.ts).

## Repository Structure

All files are inside the `src` folder, divided in two categories: `hardhat` and `utils`. The
`hardhat` folder contains the default configuration for the hardhat projects, and the `utils` folder
contains the a script to easily run ganache with some common options

### Hardhat Configuration

The hardhat configuration is divided in two files: `hardhat.default.ts` and `hardhat.helpers.ts`.

The `hardhat.default.ts` file contains the top level default configuration for the hardhat projects
including gas configuration, different networks, abis, compiler, etherscan verification and
documents generation. An explanation of all the values can be found in the
[Hardhat Configuration](https://hardhat.org/hardhat-runner/docs/config) page.

The `hardhat.helpers.ts` is an internal file that helps with configuring Hardhat for the selected
network without having to configure it manually.

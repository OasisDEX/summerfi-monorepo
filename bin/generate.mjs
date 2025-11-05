#!/usr/bin/env zx
import 'zx/globals'
$.verbose = true

// helper to copy abis
async function copyAbis(contractList, pkg) {
  for await (const f of contractList) {
    await $`mkdir -p ${dest}/${f}`
    await $`cp -vr armada-protocol/contracts/packages/${pkg}/out/${f}/*.abi.json ${dest}/${f}/`
  }
}

const mainConfig = {
  'core-contracts': [
    'AdmiralsQuarters.sol',
    'Ark.sol',
    'ConfigurationManager.sol',
    'FleetCommander.sol',
    'StakingRewardsManagerBase.sol',
    'HarborCommand.sol',
  ],
  'gov-contracts': [
    'SummerToken.sol',
    'GovernanceRewardsManager.sol',
    'SummerVestingWallet.sol',
    'SummerVestingWalletFactory.sol',
  ],
  'rewards-contracts': ['SummerRewardsRedeemer.sol'],
}
const branchConfig = {
  'core-contracts': ['AdmiralsQuartersWhitelist.sol', 'FleetCommanderWhitelist.sol'],
  'gov-contracts': ['SummerStaking.sol'],
  'access-contracts': ['ProtocolAccessManagerWhiteList.sol'],
}

const config = mainConfig

const dest = 'armada-protocol/abis/src'
await $`pwd`

// install deps
cd('armada-protocol/contracts')
await $`pnpm i`
// await $`pnpm run build`
cd('../..')

// gen abis
for (const pkg of Object.keys(config)) {
  await $`cd armada-protocol/contracts/packages/${pkg} && forge build --extra-output-files abi`
}

// copy abis
for (const [pkg, contractList] of Object.entries(config)) {
  await copyAbis(contractList, pkg)
}

// process abis to TS
await $`tsx scripts/transform-json-to-viem-abi.ts && cd armada-protocol/abis && pnpm genindex && pnpm prebuild`

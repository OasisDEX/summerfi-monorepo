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

const coreAbis = [
  'AdmiralsQuarters.sol',
  'FleetCommander.sol',
  'StakingRewardsManagerBase.sol',
  'HarborCommand.sol',
]
const rewardsAbis = ['SummerRewardsRedeemer.sol']
const govAbis = [
  'SummerToken.sol',
  'GovernanceRewardsManager.sol',
  'SummerVestingWallet.sol',
  'SummerVestingWalletFactory.sol',
]
const accessContracts = ['ProtocolAccessManagerWhiteList.sol']

const foldersDict = {
  'core-contracts': coreAbis,
  'gov-contracts': govAbis,
  'rewards-contracts': rewardsAbis,
  'access-contracts': accessContracts,
}

const dest = 'armada-protocol/abis/src'
await $`pwd`

// install deps
cd('armada-protocol/contracts')
await $`pnpm i`
// await $`pnpm run build`
cd('../..')

// gen abis
for (const pkg of Object.keys(foldersDict)) {
  await $`cd armada-protocol/contracts/packages/${pkg} && forge build --extra-output-files abi`
}

// copy abis
for (const [pkg, contractList] of Object.entries(foldersDict)) {
  await copyAbis(contractList, pkg)
}

// process abis to TS
await $`tsx scripts/transform-json-to-viem-abi.ts && cd armada-protocol/abis && pnpm genindex && pnpm prebuild`

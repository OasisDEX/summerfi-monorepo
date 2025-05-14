#!/usr/bin/env zx
import 'zx/globals'
$.verbose = true

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

const dest = 'armada-protocol/abis/src'
await $`pwd`

// install deps
cd('armada-protocol/contracts')
await $`pnpm i`
cd('../..')

// gen abis
Promise.all([
  await $`cd armada-protocol/contracts/packages/core-contracts && forge build --extra-output-files abi`,
  await $`cd armada-protocol/contracts/packages/gov-contracts && forge build --extra-output-files abi`,
  await $`cd armada-protocol/contracts/packages/rewards-contracts && forge build --extra-output-files abi`,
])

// copy abis
for await (const f of coreAbis) {
  await $`mkdir -p ${dest}/${f}`
  await $`cp -vr armada-protocol/contracts/packages/core-contracts/out/${f}/*.abi.json ${dest}/${f}/`
}
for await (const f of rewardsAbis) {
  await $`mkdir -p ${dest}/${f}`
  await $`cp -vr armada-protocol/contracts/packages/rewards-contracts/out/${f}/*.abi.json ${dest}/${f}/`
}
for await (const f of govAbis) {
  await $`mkdir -p ${dest}/${f}`
  await $`cp -vr armada-protocol/contracts/packages/gov-contracts/out/${f}/*.abi.json ${dest}/${f}/`
}

// process abis to TS
await $`tsx scripts/transform-json-to-viem-abi.ts && cd armada-protocol/abis && pnpm genindex && pnpm prebuild`

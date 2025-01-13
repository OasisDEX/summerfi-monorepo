#!/usr/bin/env zx
import 'zx/globals'
$.verbose = true

const coreAbis = [
  'AdmiralsQuarters.sol',
  'FleetCommander.sol',
  'StakingRewardsManagerBase.sol',
  'SummerVestingWallet.sol',
]
const rewardsAbis = ['SummerRewardsRedeemer.sol']
const govAbis = ['SummerToken.sol']

const dest = 'armada-protocol/abis/src'
await $`pwd`

// cd('armada-protocol/contracts')
// await $`pnpm i`
// cd('../..')

// Promise.all([
//   await $`cd armada-protocol/contracts/packages/core-contracts && forge build --extra-output-files abi`,
//   await $`cd armada-protocol/contracts/packages/gov-contracts && forge build --extra-output-files abi`,
//   await $`cd armada-protocol/contracts/packages/rewards-contracts && forge build --extra-output-files abi`,
// ])

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

await $`tsx scripts/transform-json-to-viem-abi.ts && cd armada-protocol/abis && pnpm genindex && pnpm build`

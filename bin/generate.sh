cd armada-protocol/contracts && pnpm build && cd packages/core-contracts/out/ && cp -r AdmiralsQuarters.sol FleetCommander.sol StakingRewardsManagerBase.sol SummerToken.sol SummerVestingWallet.sol ../../../../abis/src

cd ../../rewards-contracts && pnpm i && forge build --extra-output-files abi && cd out && cp -r SummerRewardsRedeemer.sol ../../../../abis/src

cd ../../../../.. && tsx ./scripts/transform-json-to-viem-abi.ts && cd armada-protocol/abis && pnpm genindex && pnpm build


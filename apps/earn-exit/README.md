# Summer.fi Exit App

Static exit-only app. Build: `pnpm turbo build --filter=@summerfi/earn-exit...` → deploy the
`apps/earn-exit/out/` directory to any static host (S3+CloudFront, Cloudflare Pages, nginx…).

- Env (build-time, optional): `NEXT_PUBLIC_RPC_URL_{MAINNET,BASE,ARBITRUM,SONIC,HYPERLIQUID}`,
  `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`. Defaults are public RPCs — the app works with none set.
- Changing an RPC URL requires a rebuild (values are inlined into the static bundle).
- Routing: real HTML files are emitted per route; if the host does not map `/portfolio` to
  `portfolio.html`, set `trailingSlash: true` in `next.config.ts` and rebuild (emits
  `portfolio/index.html`).
- Contract addresses live in `constants/addresses.ts`. `HarborCommand` comes from
  `sdk/armada-protocol-common/src/deployments/sumr.json`. **`AdmiralsQuarters` does NOT** — the
  `sumr.json` AQ addresses are stale on all five chains (they no longer hold
  `ADMIRALS_QUARTERS_ROLE`, so staked exits revert `CallerNotAdmiralsQuarters`). The AQ addresses
  here are the current role-holding deployments, found via `ProtocolAccessManager` `RoleGranted`
  logs and verified with `hasAdmiralsQuartersRole()` on every fleet's rewards manager (see the
  live-verification section below). If the deployment moves again, re-run that discovery.
- If a fleet is decommissioned during wind-down, add its address to `EXTRA_FLEETS` so remaining
  holders still see it.

Known limitations (accepted):

- USD values are approximations ($1 stables + mainnet Chainlink ETH/EUR); token amounts are exact.
- Wallets holding only unclaimed rewards (zero shares) are not listed — they have no position to
  exit; rewards for listed positions are claimed automatically (staked) or via a Claim step.
- A fleet whose buffer/arks cannot serve a full exit at that moment reverts; retrying later works.
- SUMR staking has **no USD value** shown (SUMR has no Chainlink feed and pricing it would need an
  external API — a dependency the app deliberately avoids); the SUMR amount is exact.

## SUMR governance-token staking (unstake-only)

Below the protocol positions, the portfolio also surfaces **staked SUMR** (the governance token) so
holders can unstake during the wind-down. This is the V2 `SummerStaking` system and is **completely
separate** from vault-share staking (which the fleet exit already unwinds via
`unstakeAndWithdrawAssets`).

- **Base only** — SUMR staking is deployed on a single chain (`SUMR_STAKING` in
  `constants/addresses.ts`). The `SummerStaking` and SUMR-token addresses come from the SDK
  deployment config (`sumr.json` `govV2`); the stSUMR staked-receipt token is resolved on-chain via
  `STAKED_SUMMER_TOKEN()` (it is the token approved before unstaking).
- **Per stake** — a user holds N independent stakes, each with its own lockup and amount. Unstaking
  is `unstakeLockup(stakeIndex, amount)`, one stake at a time: `SummerStaking` swap-and-pops emptied
  stakes, so indices shift — the modal reloads after any executed tx to re-read fresh indices.
- **Early-unstake penalty** — while a stake is locked and `penaltyEnabled()` is true, unstaking
  applies a penalty (2% floor near expiry, ramping toward 20% for long locks). The exact penalty %
  and net SUMR received are read on-chain (`calculatePenaltyPercentage` / `calculatePenalty`) and
  shown before the user confirms.
- **Steps** — `[approve stSUMR (if needed)] → unstakeLockup`. Unstaking does not auto-claim, so a
  "Claim" action is offered: a **self-claim** `getReward(rewardToken)` per reward token with an
  earned balance. (Not `getRewardFor(account, token)` — that is the on-behalf/keeper path and
  reverts with a caller-not-authorized error when a user calls it for themselves.)

Smoke-test the read path with `scripts/check-staked-sumr.ts` (below).

## SUMR staking live-chain verification (2026-07-20, Base fork)

Verified the `SummerStaking` read path against the Tenderly Base fork:

- `SummerStaking` (`0xcA2e…15b4`) is live; `SUMMER_TOKEN()` returns `0x194f…1624` — an **exact match**
  for the hardcoded `SUMR_STAKING.sumrToken`.
- `STAKED_SUMMER_TOKEN()` resolves to `0x7cC4…0D1c` (symbol `stSUMR`) — the token approved before
  unstaking.
- `penaltyEnabled()` is `true`; reward tokens = `[SUMR]`.
- Full per-user reads across real stakers confirmed: multi-stake accounts (30+ stakes) parse
  correctly, zero-amount stakes are filtered, `isLocked` is derived correctly, and the penalty
  percentage scaling (`/1e16`) produces sane values (2% near expiry → ~19% for 3-year locks) with
  matching absolute penalty amounts.
- **Write path executed end-to-end** against the fork (impersonated stakers), driving the real
  `getStakedSumr` → `buildUnstakePlan` code:
  - Unlocked stake: `unstakeLockup` + self-claim `getReward` both succeed; the full staked amount
    plus claimed rewards land in the wallet, no penalty.
  - Locked stake: `approve stSUMR → unstakeLockup` succeeds and the on-chain penalty deduction
    matches the UI's predicted "you'll receive" figure to the token (e.g. 202,356 SUMR unstaked at
    a 16.73% penalty returned ≈168,506 SUMR).
  - Unstaking a stake **reorganizes the array (swap-and-pop): indices shift**, so the app must
    re-read between unstakes — which it does (the modal reloads on any executed tx). Verified by
    unstaking all 5 stakes of one wallet in a loop that re-reads each round; a batch built against
    stale indices would target the wrong stakes.

## Test-only wallet shim (dev/fork use only)

`app/layout.tsx` conditionally loads `public/test-wallet-shim.js` when the build/dev-time env var
`NEXT_PUBLIC_TEST_WALLET` is set (see `NEXT_PUBLIC_TEST_WALLET_RPC` /
`NEXT_PUBLIC_TEST_WALLET_CHAIN_ID` for the account/RPC it injects). It exists purely to make the
anvil-fork rehearsal (see the phase-5 plan, Task 5.3) drivable without a browser extension wallet:
with the env var set it injects a raw-private-key signer wired to a local RPC (e.g.
`http://127.0.0.1:8545`) as an EIP-1193 provider, so the Connect flow can sign against a fork using
anvil's published test key.

- **Inert in production**: with `NEXT_PUBLIC_TEST_WALLET` unset (the default — do not set it in any
  real deployment), `layout.tsx` never evaluates the injection and the script is never referenced
  from the emitted HTML. Verified for this build: `out/index.html` and `out/portfolio.html` contain
  no `<script>` reference to `test-wallet-shim.js`, even though the file itself is copied into
  `out/` as a static asset because everything under `public/` is copied verbatim by Next's static
  export — that copy is harmless since nothing loads it.
- **To use it against a fork**: start `anvil --fork-url <chain RPC> --chain-id <id> --port 8545`,
  then run the dev server with
  `NEXT_PUBLIC_TEST_WALLET=1 NEXT_PUBLIC_TEST_WALLET_RPC=http://127.0.0.1:8545 NEXT_PUBLIC_TEST_WALLET_CHAIN_ID=<id> pnpm --filter @summerfi/earn-exit dev`.

## Live-chain verification (2026-07-16)

Addresses in `constants/addresses.ts` were re-verified against deployed contracts on all five chains
as part of Phase 5:

- `HarborCommand`: `sumr.json` → `constants/addresses.ts` **exact match**, all 5 chains; and
  `getActiveFleetCommanders()` returns a non-empty fleet list on all 5 chains (Ethereum: 7, Base: 3,
  Arbitrum: 3, Sonic: 1, Hyperliquid: 2 active fleets at verification time).
- `AdmiralsQuarters`: **`sumr.json` addresses are stale on all 5 chains** — verified on-chain that
  they no longer hold `ADMIRALS_QUARTERS_ROLE` on any fleet's `StakingRewardsManager`
  (`hasAdmiralsQuartersRole()` → `false` everywhere), so a staked exit through them reverts
  `CallerNotAdmiralsQuarters` (`0x8e866cef`). `constants/addresses.ts` instead uses the current
  role-holding AQ per chain (mainnet `0xD03bD9…22Dba`, base `0x4e9207…313a`, arbitrum
  `0x1db04f…1219`, sonic `0xa514a9…4410`, hyperliquid `0x3D4AE5…32a5`), each confirmed:
  `hasAdmiralsQuartersRole()` → `true` on **every** fleet SRM on its chain, and all 4 exit-path
  selectors (`exitFleet`, `withdrawTokens`, `unstakeAndWithdrawAssets`, `multicall`) present in
  deployed bytecode. A full staked exit was executed end-to-end against a mainnet fork through the
  UI to confirm.
- `FleetCommander` (ERC-4626 share token) ABI selectors used by the app (`approve`, `balanceOf`,
  `convertToAssets`, `asset`, `name`, `decimals`, `paused`, `allowance`, `config`) and
  `StakingRewardsManagerBase` selectors (`balanceOf`, `earned(address,address)`,
  `rewardTokensLength`, `rewardTokens`, `getReward`, `stakingToken`) all confirmed present in
  bytecode against a real mainnet fleet + its rewards manager, plus a live
  `config()`/`asset()`/`name()` read and a `stakingToken() == fleet` wiring check on the Base USDC
  fleet.
- Chainlink `ETH/USD` and `EUR/USD` feed addresses confirmed via `description()`.
- Cross-chain read smoke: `scripts/check-positions.ts` against one known holder per chain returned
  ≥1 position on every chain with no failed-chain warnings.

Full command-by-command output lives in the Phase 5 verification report (not part of this repo).

## `scripts/check-positions.ts`

Read-only CLI smoke test — walks `HarborCommand` + `EXTRA_FLEETS` on every supported chain and
prints any fleet position (wallet + staked shares, converted to assets) for a given address, using
the same on-chain read path the app uses.

```bash
cd apps/earn-exit
npx tsx --tsconfig tsconfig.json scripts/check-positions.ts 0xYourAddress
```

Override a chain's RPC for the run (useful when a default public RPC is flaky) with the same
`NEXT_PUBLIC_RPC_URL_*` env vars the app reads, e.g.:

```bash
NEXT_PUBLIC_RPC_URL_MAINNET=https://ethereum-rpc.publicnode.com \
  npx tsx --tsconfig tsconfig.json scripts/check-positions.ts 0xYourAddress
```

Exits after printing each position and a count; prints `failed chains: [...]` if any chain's RPC
call errored (the run should still complete for the rest).

---
description: Version history of the @summer_fi/sdk-client bundle.
---

# Changelog

Version history for `@summer_fi/sdk-client`. Latest version: **v2.4.0**.

## v2.4.0

**Features:**

- **DCA Strategies (`sdk.dca`)**: New module for automated dollar-cost-averaging — recurring,
  on-chain buy orders that periodically swap out of one vault and into another.
  - **createStrategyTx** — create and fund a new DCA strategy in a single flow. Configure the
    source/target vaults, in/out assets and their price feeds, the per-trade amount, interval,
    number of trades, slippage tolerance, optional price guards (never-buy-above / never-sell-below),
    and a deadline. Returns the create transaction, prefixed with an ERC-20 approval transaction when
    the initial deposit needs one — send them in order.
  - **editStrategyTx** — change an existing strategy's parameters (e.g. slippage, interval, trade
    amount, price guards). Pass the current strategy plus an `update` object carrying only the fields
    to change.
  - **pauseStrategyTx** / **resumeStrategyTx** — temporarily halt an active strategy and resume a
    paused one.
  - **cancelStrategyTx** — permanently cancel a strategy.
  - **getStrategies** — list strategies on a chain, optionally filtered by owner and status.
  - **getStrategy** — fetch a single strategy by its on-chain id.
  - **getExecutions** / **getExecution** — read the individual trades a strategy has executed.
  - Available on Base and Mainnet.
- **Real-World Assets / Institutional Vaults (`sdk.rwa`)**: New top-level module for RWA
  rounds-based vaults, covering the full deposit → settle → claim lifecycle, portfolio reads, and
  institutional whitelisting.
  - Deposits & withdrawals (rounds model):
    - **getDepositTx** — deposit the vault's asset into the current round (with an approval
      transaction if needed).
    - **getClaimSharesTx** — claim vault shares once a deposit round has settled.
    - **getWithdrawTx** — request a withdrawal into the current round (with an approval transaction
      if needed).
    - **getClaimAssetsTx** — claim the underlying assets once a withdrawal round has settled.
    - **getCancelRoundDepositTx** — cancel a deposit or withdrawal while its round is still open.
  - Round & receipt reads:
    - **getCurrentRound** / **getRoundState** — inspect the active round and its lifecycle state.
    - **getExchangeRate** — the settled exchange rate for a round.
    - **getReceiptBalances** — the caller's outstanding round receipts (pending and claimable
      positions).
  - Portfolio reads:
    - **getUserVaultExposure** — a user's total exposure to a vault (settled position plus pending
      deposits, claimable deposits, and pending withdrawals), with a USD valuation and a
      per-component breakdown.
    - **getVaultMarketValue** — a vault's total value (TVL) across the Fleet and both rounds vaults,
      with a USD valuation and breakdown.
  - Position sizing: **getSetMinimumPositionSizeTx** — set a vault's minimum position size (manager
    action).
  - Institutional whitelisting (requires the institutional SDK — see **makeInstiSdk**):
    - **getSetWhitelistedTx** / **getSetWhitelistedBatchTx** — allow or disallow one or many
      accounts on a vault.
    - **getSetWhitelistOpenTx** — toggle open (permissionless) access for a vault.
    - **isWhitelisted** / **isWhitelistOpen** — read a vault's whitelist status.
  - **makeInstiSdk** — new client factory for institutional (v2) access; sends the institution's
    `Client-Id` and resolves per-institution deployments so RWA and whitelisting calls target the
    right vaults.
  - Available on Mainnet and Base.

## v2.3.0

**Features:**

- **Cross-Chain Deposits**: New method to deposit tokens from one chain into vaults on another
  chain.
  - **getCrossChainDepositTx** — generate transactions for cross-chain vault deposits.
  - Seamlessly bridge and deposit tokens across different chains in a single transaction flow.
  - Supports deposits from Base, Arbitrum, Optimism, Mainnet, and Sonic to any supported chain.
  - Automatically handles cross-chain bridging and token conversions.
  - Returns an approval transaction (if needed) and a deposit transaction.
  - Example: deposit USDC from Base directly into an Arbitrum vault.

## v2.2.0

**Features:**

- **Position Transaction History**: New methods to retrieve detailed deposit and withdrawal
  transaction history.
  - **getDeposits** — fetch all deposit transactions for a specific position.
    - Returns detailed information for each deposit including amounts, USD values, timestamps, and
      transaction hashes.
    - Includes vault balance after each deposit for tracking position growth.
    - Supports pagination with `first` and `skip` parameters (default: first 1000 records).
    - Each deposit includes: `from`, `to`, `amount`, `amountUsd`, `timestamp`, `txHash`,
      `vaultBalance`, and `vaultBalanceUsd`.
  - **getWithdrawals** — fetch all withdrawal transactions for a specific position.
    - Returns detailed information with the same structure as deposits.
    - Tracks vault balance after each withdrawal.
    - Supports pagination with `first` and `skip` parameters (default: first 1000 records).
    - Useful for audit trails, tax reporting, and transaction history analysis.
  - Both methods return empty arrays for positions with no transactions.
  - Results are ordered by timestamp in descending order (newest first).

## v2.1.0

**Features:**

- **Historical Vault Rates**: New method to retrieve historical rate data for vaults.
  - **getVaultsHistoricalRates** — fetch historical rates for one or more vaults across different
    time periods.
  - Supports multiple time granularities: hourly, daily, and weekly aggregated rates.
  - Includes the latest rate snapshot for real-time data.
  - Cross-chain support — query vaults from different chains in a single request.
  - Returns structured data with the `HistoricalFleetRateResult` type including `dailyRates`,
    `hourlyRates`, `weeklyRates`, and `latestRate`.
- **Position History**: New method to retrieve historical snapshots of position value over time.
  - **getPositionHistory** — fetch historical data for a specific user position.
  - Returns hourly, daily, and weekly position snapshots.
  - Each snapshot includes `timestamp`, `netValue`, `deposits`, and `withdrawals`.
  - Useful for tracking position performance and generating historical charts.
  - Returns `null` for positions that don't exist or have no activity.
- **ERC20 Token Transfers**: New method for generating ERC20 token transfer transactions.
  - **getErc20TokenTransferTx** — generate a transaction to transfer ERC20 tokens to any address.
  - Cross-chain support for all supported networks (Base, Arbitrum, Optimism, Mainnet, Sonic).
  - Simple interface requiring only chainId, token address, recipient, and amount.
  - Returns a properly formatted transaction with complete metadata.
- **Enhanced Vault APY Data**: Vault info now includes multiple APY time periods.
  - Added `apys` property to `IArmadaVaultInfo` with `live`, `sma24h`, `sma7day`, and `sma30day`.
  - All APY values are nullable `IPercentage` types.
  - Available in both `getVaultInfo()` and `getVaultInfoList()` responses.
- **Vault Share Price**: Vault info now includes the current share price.
  - Added `sharePrice` property to `IArmadaVaultInfo` (an `IPrice`, e.g. "1.0005 WETH per LVWETH").
  - Available in both `getVaultInfo()` and `getVaultInfoList()` responses.
- **Enhanced Position Interface**: `IArmadaPosition` now includes comprehensive metrics and earnings
  tracking.
  - New properties: `assets`, `assetPriceUSD`, `assetsUSD`, `netDeposits`, `netDepositsUSD`,
    `earnings`, `earningsUSD`.
  - Deprecated (still available): `amount` — use `assets` instead.

**Breaking Changes:**

- Removed the `deposits` and `withdrawals` arrays from `IArmadaPosition`.

**Migration Steps:**

The `deposits` and `withdrawals` arrays were replaced with aggregated amounts and new calculated
metrics:

- For deposit/withdrawal totals: use `depositsAmount`, `withdrawalsAmount`, `depositsAmountUSD`, and
  `withdrawalsAmountUSD`.
- For current position value: use `assets` instead of the deprecated `amount` property.

## v2.0.0

**Features:**

- **Intent-based Swaps using CoW Protocol**: Full integration for gasless, MEV-protected trading.
  - **getSellOrderQuote** — get quotes for token swaps with optional limit prices.
  - **sendOrder** — submit orders with automatic native-currency wrapping and token approval.
  - **cancelOrder** — cancel existing orders before execution.
  - **checkOrder** — monitor order status and execution details.
  - Supports limit orders, partial fills, and custom receivers.
  - Automatic native-currency wrapping (e.g. ETH → WETH) and smart ERC-20 approval management.
- **Enhanced Token Balance Lookups**: New methods for checking token balances
  (`getTokenBalanceBySymbol`, `getTokenBalanceByAddress`) for native currencies and ERC-20 tokens.
- **Enhanced Armada Vault Information**: Vault info now includes underlying asset details.
  - Added the `assetToken` field to `IArmadaVaultInfo` indicating the underlying depositable asset.
- **CORS Support**: Added OPTIONS request handling for browser usage compatibility.

**Breaking Changes:**

- `@summerfi/sdk-common` was deprecated and merged into `@summer_fi/sdk-client`.

**Migration steps:**

- Update all imports from `@summerfi/sdk-common` to `@summer_fi/sdk-client` and remove the
  deprecated `@summerfi/sdk-common` package.

> Note: The v2.0.0 release notes reference a `makeSDKWithSigner()` factory for signed operations.
> In the current bundle (v2.3.0) the public package exports `makeSDK` and `makeAdminSDK`; intent-swap
> operations use the standard `sdk.intentSwaps` client and accept a viem wallet/public client per
> call. See the [Intent Swaps](guides/intent-swaps.md) guide.

## v1.1.0

**Features:**

- **Merkl Rewards Information**: Vault info now includes Merkl rewards data.
  - Added `merklRewards` to `IArmadaVaultInfo` with `token` and `dailyEmission` (in wei, as a
    string).
  - Present only when a vault has active Merkl rewards, otherwise undefined.
- New reward flows: **getUserMerklRewards**, **getUserMerklClaimTx**, **getReferralFeesMerklClaimTx**,
  **getIsAuthorizedAsMerklRewardsOperator**, **getAuthorizeAsMerklRewardsOperatorTx**,
  **getAggregatedRewards**, and **getAggregatedRewardsIncludingMerkl**.
- **Streamlined User Creation**: Added `User.createFromEthereum(chainId, address)`.
- **Improved Token Access Pattern**: Added `sdk.tokens.getTokenBySymbol(...)` and
  `sdk.tokens.getTokenByAddress(...)`. The previous `chain.tokens.getTokenBySymbol()` pattern is
  still supported.

## v1.0.1

- Added the `apiDomainUrl` param to the **makeSDK** factory function for a cleaner interface — it
  takes the API domain name instead of a direct API endpoint URL.

## v1.0.0

- Versioned API support.

## v0.5.0

**Features:**

- Added the `referralCode` argument to deposits — **getNewDepositTx**.
- Breaking: refactored the `deposits` and `withdrawals` fields on the `IArmadaPosition` interface.

## v0.4.0

**Features:**

- Added the Vault Switch feature — **getVaultSwitchTx**.
- Added retrieval of vaults with extended info — **getVaultInfoList**.

**Docs:**

- Added a new section documenting transaction entities.

## v0.3.1

- First public release.

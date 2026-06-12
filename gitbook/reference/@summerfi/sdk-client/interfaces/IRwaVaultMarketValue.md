# Interface: IRwaVaultMarketValue

Defined in: [../sdk-common/src/common/interfaces/IRwaVaultMarketValue.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRwaVaultMarketValue.ts#L23)

IRwaVaultMarketValue

## Description

The total market value (true TVL) of an RWA vault across all users, treating the
             Fleet and both RoundsVaults as one system. All amounts are denominated in the Fleet
             input asset (e.g. USDC).

             `total = fleetAssets + pendingDeposits + claimableWithdrawals`.
             - `fleetAssets` is the Fleet on-chain `totalAssets()` (subgraph
               `vault.inputTokenBalance`). It ALREADY includes settled-but-unclaimed deposits
               (deposited into the Fleet at settlement) and ALREADY excludes settled-but-unclaimed
               withdrawals (redeemed out of the Fleet at settlement).
             - `pendingDeposits` is the USDC still sitting in the Input RoundsVault for
               not-yet-settled rounds (vault-wide, summed from per-round `receiptSupply`).
             - `claimableWithdrawals` is the USDC sitting in the Output RoundsVault for settled,
               unredeemed rounds (share supply converted via each round's settled exchange rate).

             Open/in-settlement output rounds are intentionally NOT added — their underlying is
             still in the Fleet (already counted in `fleetAssets`).

## Properties

### claimableWithdrawals

```ts
claimableWithdrawals: ITokenAmount;
```

Defined in: [../sdk-common/src/common/interfaces/IRwaVaultMarketValue.ts:33](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRwaVaultMarketValue.ts#L33)

Vault-wide Output-RoundsVault funds in settled, unredeemed rounds (claimable withdrawals)

***

### fleetAssets

```ts
fleetAssets: ITokenAmount;
```

Defined in: [../sdk-common/src/common/interfaces/IRwaVaultMarketValue.ts:29](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRwaVaultMarketValue.ts#L29)

Fleet on-chain total assets (subgraph `vault.inputTokenBalance`)

***

### pendingDeposits

```ts
pendingDeposits: ITokenAmount;
```

Defined in: [../sdk-common/src/common/interfaces/IRwaVaultMarketValue.ts:31](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRwaVaultMarketValue.ts#L31)

Vault-wide Input-RoundsVault funds in non-settled rounds (deposits awaiting settlement)

***

### total

```ts
total: ITokenAmount;
```

Defined in: [../sdk-common/src/common/interfaces/IRwaVaultMarketValue.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRwaVaultMarketValue.ts#L25)

Sum of all components below, in the Fleet input asset

***

### totalUsd

```ts
totalUsd: IFiatCurrencyAmount;
```

Defined in: [../sdk-common/src/common/interfaces/IRwaVaultMarketValue.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRwaVaultMarketValue.ts#L27)

`total` valued in USD via the vault `inputTokenPriceUSD`

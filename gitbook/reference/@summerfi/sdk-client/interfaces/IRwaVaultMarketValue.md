# Interface: IRwaVaultMarketValue

Defined in: [../sdk-common/src/common/interfaces/IRwaVaultMarketValue.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRwaVaultMarketValue.ts#L22)

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

Defined in: [../sdk-common/src/common/interfaces/IRwaVaultMarketValue.ts:32](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRwaVaultMarketValue.ts#L32)

Vault-wide Output-RoundsVault funds in settled, unredeemed rounds (claimable withdrawals)

***

### fleetAssets

```ts
fleetAssets: ITokenAmount;
```

Defined in: [../sdk-common/src/common/interfaces/IRwaVaultMarketValue.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRwaVaultMarketValue.ts#L28)

Fleet on-chain total assets (subgraph `vault.inputTokenBalance`)

***

### pendingDeposits

```ts
pendingDeposits: ITokenAmount;
```

Defined in: [../sdk-common/src/common/interfaces/IRwaVaultMarketValue.ts:30](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRwaVaultMarketValue.ts#L30)

Vault-wide Input-RoundsVault funds in non-settled rounds (deposits awaiting settlement)

***

### total

```ts
total: ITokenAmount;
```

Defined in: [../sdk-common/src/common/interfaces/IRwaVaultMarketValue.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRwaVaultMarketValue.ts#L24)

Sum of all components below, in the Fleet input asset

***

### totalUsd

```ts
totalUsd: IFiatCurrencyAmount;
```

Defined in: [../sdk-common/src/common/interfaces/IRwaVaultMarketValue.ts:26](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRwaVaultMarketValue.ts#L26)

`total` valued in USD via the vault `inputTokenPriceUSD`

# Interface: IRwaUserVaultExposure

Defined in: [../sdk-common/src/common/interfaces/IRwaUserVaultExposure.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRwaUserVaultExposure.ts#L18)

IRwaUserVaultExposure

## Description

A single user's total economic exposure to an RWA vault, stitched from the three
             money pools of the RoundsVault settlement model: the settled Fleet position, the
             Input RoundsVault (pending + claimable deposits) and the Output RoundsVault (pending
             withdrawals). All amounts are denominated in the Fleet input asset (e.g. USDC) —
             withdrawal (share-denominated) receipts are converted via the vault `pricePerShare`.

             `total = settledPosition + pendingDeposits + claimableDeposits + pendingWithdrawals`.
             `claimableDeposits` is a genuine additive term: settled-but-unclaimed deposit shares
             are held by the RoundsVault contract, not the user, so they are NOT reflected in the
             subgraph's per-user `position.inputTokenBalance` (`settledPosition`). Claimable
             (settled, unredeemed) withdrawals are intentionally excluded.

## Properties

### claimableDeposits

```ts
claimableDeposits: ITokenAmount;
```

Defined in: [../sdk-common/src/common/interfaces/IRwaUserVaultExposure.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRwaUserVaultExposure.ts#L28)

Input-vault receipts in settled rounds (shares awaiting claim; not in `settledPosition`)

***

### pendingDeposits

```ts
pendingDeposits: ITokenAmount;
```

Defined in: [../sdk-common/src/common/interfaces/IRwaUserVaultExposure.ts:26](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRwaUserVaultExposure.ts#L26)

Input-vault receipts in non-settled rounds (deposits awaiting settlement)

***

### pendingWithdrawals

```ts
pendingWithdrawals: ITokenAmount;
```

Defined in: [../sdk-common/src/common/interfaces/IRwaUserVaultExposure.ts:30](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRwaUserVaultExposure.ts#L30)

Output-vault receipts in non-settled rounds, converted shares→input asset via pricePerShare

***

### settledPosition

```ts
settledPosition: ITokenAmount;
```

Defined in: [../sdk-common/src/common/interfaces/IRwaUserVaultExposure.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRwaUserVaultExposure.ts#L24)

Settled Fleet position (subgraph `position.inputTokenBalance`)

***

### total

```ts
total: ITokenAmount;
```

Defined in: [../sdk-common/src/common/interfaces/IRwaUserVaultExposure.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRwaUserVaultExposure.ts#L20)

Sum of all components below, in the Fleet input asset

***

### totalUsd

```ts
totalUsd: IFiatCurrencyAmount;
```

Defined in: [../sdk-common/src/common/interfaces/IRwaUserVaultExposure.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRwaUserVaultExposure.ts#L22)

`total` valued in USD via the vault `inputTokenPriceUSD`

# Function: isArmadaWithdrawal()

```ts
function isArmadaWithdrawal(maybeArmadaWithdrawal, returnedErrors?): maybeArmadaWithdrawal is Readonly<{ amount: ITokenAmount; amountUsd: IFiatCurrencyAmount; from: `0x${string}`; timestamp: number; to: `0x${string}`; txHash: `0x${string}`; vaultBalance: ITokenAmount; vaultBalanceUsd: IFiatCurrencyAmount }>;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IArmadaWithdrawal.ts:33](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/IArmadaWithdrawal.ts#L33)

## Parameters

### maybeArmadaWithdrawal

`unknown`

Object to be checked

### returnedErrors?

`string`[]

Optional array that, on failure, is populated with validation error messages

## Returns

`` maybeArmadaWithdrawal is Readonly<{ amount: ITokenAmount; amountUsd: IFiatCurrencyAmount; from: `0x${string}`; timestamp: number; to: `0x${string}`; txHash: `0x${string}`; vaultBalance: ITokenAmount; vaultBalanceUsd: IFiatCurrencyAmount }> ``

true if the object is an IArmadaWithdrawal

## Description

Type guard for IArmadaWithdrawal

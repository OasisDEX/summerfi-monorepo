# Function: isTokenAmountData()

```ts
function isTokenAmountData(maybeTokenAmount): maybeTokenAmount is Readonly<{ amount: string; token: ITokenStanalone }>;
```

Defined in: [sdk/sdk-common/src/common/interfaces/ITokenAmount.ts:164](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/ITokenAmount.ts#L164)

## Parameters

### maybeTokenAmount

`unknown`

## Returns

`maybeTokenAmount is Readonly<{ amount: string; token: ITokenStanalone }>`

true if the object is an ITokenAmountData

## Description

Type guard for ITokenAmountData

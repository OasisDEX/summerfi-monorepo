# Function: isFiatCurrencyAmount()

```ts
function isFiatCurrencyAmount(maybeTokenAmount): maybeTokenAmount is IFiatCurrencyAmount;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IFiatCurrencyAmount.ts:100](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/IFiatCurrencyAmount.ts#L100)

## Parameters

### maybeTokenAmount

`unknown`

## Returns

`maybeTokenAmount is IFiatCurrencyAmount`

true if the object is an ITokenAmount

## Description

Type guard for IFiatCurrencyAmount

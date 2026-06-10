# Function: isAmountValue()

```ts
function isAmountValue(value): value is string;
```

Defined in: [sdk/sdk-common/src/common/types/AmountValue.ts:10](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/types/AmountValue.ts#L10)

Type guard that checks whether a value is a valid [AmountValue](../type-aliases/AmountValue.md).

## Parameters

### value

`unknown`

The value to test.

## Returns

`value is string`

`true` if the value is a string parseable as a `BigInt`.

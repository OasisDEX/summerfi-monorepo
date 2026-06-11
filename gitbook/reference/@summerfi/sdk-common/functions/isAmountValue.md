# Function: isAmountValue()

```ts
function isAmountValue(value): value is string;
```

Defined in: [src/common/types/AmountValue.ts:10](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/types/AmountValue.ts#L10)

Type guard that checks whether a value is a valid [AmountValue](../type-aliases/AmountValue.md).

## Parameters

### value

`unknown`

The value to test.

## Returns

`value is string`

`true` if the value is a string parseable as a `BigInt`.

# Function: isAmountValue()

```ts
function isAmountValue(value): value is string;
```

Defined in: [sdk/sdk-common/src/common/types/AmountValue.ts:10](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/types/AmountValue.ts#L10)

Type guard that checks whether a value is a valid [AmountValue](../type-aliases/AmountValue.md).

## Parameters

### value

`unknown`

The value to test.

## Returns

`value is string`

`true` if the value is a string parseable as a `BigInt`.

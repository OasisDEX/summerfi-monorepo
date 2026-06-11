# Function: isAddressValue()

```ts
function isAddressValue(value): value is `0x${string}`;
```

Defined in: [src/common/types/AddressValue.ts:12](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/types/AddressValue.ts#L12)

Type guard that checks whether a value is a valid [AddressValue](../type-aliases/AddressValue.md).

## Parameters

### value

`unknown`

The value to test.

## Returns

`` value is `0x${string}` ``

`true` if the value is a string that parses as an EVM address.

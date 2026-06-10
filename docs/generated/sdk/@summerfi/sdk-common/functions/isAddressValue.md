# Function: isAddressValue()

```ts
function isAddressValue(value): value is `0x${string}`;
```

Defined in: [sdk/sdk-common/src/common/types/AddressValue.ts:12](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/types/AddressValue.ts#L12)

Type guard that checks whether a value is a valid [AddressValue](../type-aliases/AddressValue.md).

## Parameters

### value

`unknown`

The value to test.

## Returns

`` value is `0x${string}` ``

`true` if the value is a string that parses as an EVM address.

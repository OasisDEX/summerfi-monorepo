# Function: isAddressValue()

```ts
function isAddressValue(value): value is `0x${string}`;
```

Defined in: [sdk/sdk-common/src/common/types/AddressValue.ts:12](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/types/AddressValue.ts#L12)

Type guard that checks whether a value is a valid [AddressValue](../type-aliases/AddressValue.md).

## Parameters

### value

`unknown`

The value to test.

## Returns

`` value is `0x${string}` ``

`true` if the value is a string that parses as an EVM address.

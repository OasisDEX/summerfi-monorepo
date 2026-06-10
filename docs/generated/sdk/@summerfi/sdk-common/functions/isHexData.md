# Function: isHexData()

```ts
function isHexData(value): value is `0x${string}`;
```

Defined in: [sdk/sdk-common/src/common/types/HexData.ts:12](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/types/HexData.ts#L12)

Type guard that checks whether a value is valid [HexData](../type-aliases/HexData.md).

## Parameters

### value

`unknown`

The value to test.

## Returns

`` value is `0x${string}` ``

`true` if the value is a `0x`-prefixed hex string.

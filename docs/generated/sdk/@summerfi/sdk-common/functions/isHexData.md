# Function: isHexData()

```ts
function isHexData(value): value is `0x${string}`;
```

Defined in: [src/common/types/HexData.ts:12](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/types/HexData.ts#L12)

Type guard that checks whether a value is valid [HexData](../type-aliases/HexData.md).

## Parameters

### value

`unknown`

The value to test.

## Returns

`` value is `0x${string}` ``

`true` if the value is a `0x`-prefixed hex string.

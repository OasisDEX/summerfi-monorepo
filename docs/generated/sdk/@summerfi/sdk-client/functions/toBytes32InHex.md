# Function: toBytes32InHex()

```ts
function toBytes32InHex(value): `0x${string}`;
```

Defined in: [sdk/sdk-common/src/common/utils/toBytes32InHex.ts:10](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/utils/toBytes32InHex.ts#L10)

Encodes a string as a right-padded 32-byte hex value (`bytes32`).

## Parameters

### value

`string`

The non-empty string to encode.

## Returns

`` `0x${string}` ``

The value as a 32-byte hex string.

## Throws

Error if `value` is empty.

# Function: isChainId()

```ts
function isChainId(maybeChainId): maybeChainId is ChainId;
```

Defined in: [sdk/sdk-common/src/common/types/ChainId.ts:31](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/types/ChainId.ts#L31)

Type guard that checks whether a value is a supported [ChainId](../type-aliases/ChainId.md).

## Parameters

### maybeChainId

`unknown`

The value to test.

## Returns

`maybeChainId is ChainId`

`true` if the value is a supported chain id.

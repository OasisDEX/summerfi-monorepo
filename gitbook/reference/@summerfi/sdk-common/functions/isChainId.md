# Function: isChainId()

```ts
function isChainId(maybeChainId): maybeChainId is ChainId;
```

Defined in: [src/common/types/ChainId.ts:30](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/types/ChainId.ts#L30)

Type guard that checks whether a value is a supported [ChainId](../type-aliases/ChainId.md).

## Parameters

### maybeChainId

`unknown`

The value to test.

## Returns

`maybeChainId is ChainId`

`true` if the value is a supported chain id.

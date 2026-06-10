# Function: isLegacyChainId()

```ts
function isLegacyChainId(maybeChainId): maybeChainId is LegacyChainId;
```

Defined in: [../sdk-common/src/common/types/ChainId.ts:59](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/types/ChainId.ts#L59)

Type guard that checks whether a value is a [LegacyChainId](../type-aliases/LegacyChainId.md).

## Parameters

### maybeChainId

`unknown`

The value to test.

## Returns

`maybeChainId is LegacyChainId`

`true` if the value is a legacy chain id.

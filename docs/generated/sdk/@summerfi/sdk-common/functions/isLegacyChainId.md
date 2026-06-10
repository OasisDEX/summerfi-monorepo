# Function: isLegacyChainId()

```ts
function isLegacyChainId(maybeChainId): maybeChainId is LegacyChainId;
```

Defined in: [sdk/sdk-common/src/common/types/ChainId.ts:59](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/types/ChainId.ts#L59)

Type guard that checks whether a value is a [LegacyChainId](../type-aliases/LegacyChainId.md).

## Parameters

### maybeChainId

`unknown`

The value to test.

## Returns

`maybeChainId is LegacyChainId`

`true` if the value is a legacy chain id.

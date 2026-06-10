# Function: chainIdToGraphChain()

```ts
function chainIdToGraphChain(chainId): GraphChain;
```

Defined in: [sdk/sdk-common/src/common/utils/chainIdToGraphChain.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/utils/chainIdToGraphChain.ts#L22)

Maps a numeric chain id to its subgraph [GraphChain](../type-aliases/GraphChain.md) slug.

## Parameters

### chainId

`number`

The numeric chain id to map.

## Returns

[`GraphChain`](../type-aliases/GraphChain.md)

The corresponding subgraph chain slug.

## Throws

Error if the chain id is not supported.

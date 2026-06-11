# Function: chainIdToGraphChain()

```ts
function chainIdToGraphChain(chainId): GraphChain;
```

Defined in: [../sdk-common/src/common/utils/chainIdToGraphChain.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/utils/chainIdToGraphChain.ts#L22)

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

# Function: valuesOfChainFamilyMap()

```ts
function valuesOfChainFamilyMap(families): ChainInfo[];
```

Defined in: [../sdk-common/src/common/implementation/ChainFamilies.ts:144](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ChainFamilies.ts#L144)

Collects every [ChainInfo](../classes/ChainInfo.md) belonging to the given chain families.

## Parameters

### families

[`ChainFamilyName`](../enumerations/ChainFamilyName.md)[]

The chain families whose chains should be collected.

## Returns

[`ChainInfo`](../classes/ChainInfo.md)[]

The flattened list of [ChainInfo](../classes/ChainInfo.md) for the requested families.

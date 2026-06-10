# Type Alias: ReferenceableField\<T\>

```ts
type ReferenceableField<T> = T | ValueReference<T>;
```

Defined in: [sdk/sdk-common/src/simulation/interfaces/ValueReference.ts:11](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/simulation/interfaces/ValueReference.ts#L11)

A field that may be either a concrete value of type `T` or a [ValueReference](../interfaces/ValueReference.md) to one.

## Type Parameters

### T

`T`

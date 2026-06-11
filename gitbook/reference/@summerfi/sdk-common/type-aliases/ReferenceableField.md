# Type Alias: ReferenceableField\<T\>

```ts
type ReferenceableField<T> = T | ValueReference<T>;
```

Defined in: [src/simulation/interfaces/ValueReference.ts:11](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/interfaces/ValueReference.ts#L11)

A field that may be either a concrete value of type `T` or a [ValueReference](../interfaces/ValueReference.md) to one.

## Type Parameters

### T

`T`

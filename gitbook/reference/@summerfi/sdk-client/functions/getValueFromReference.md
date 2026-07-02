# Function: getValueFromReference()

```ts
function getValueFromReference<T>(reference): T;
```

Defined in: [../sdk-common/src/simulation/interfaces/ValueReference.ts:30](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/interfaces/ValueReference.ts#L30)

Resolves a [ReferenceableField](../type-aliases/ReferenceableField.md) to its concrete value, returning the estimated value when
it is a [ValueReference](../interfaces/ValueReference.md).

## Type Parameters

### T

`T`

## Parameters

### reference

[`ReferenceableField`](../type-aliases/ReferenceableField.md)\<`T`\>

The field to resolve.

## Returns

`T`

The concrete value of type `T`.

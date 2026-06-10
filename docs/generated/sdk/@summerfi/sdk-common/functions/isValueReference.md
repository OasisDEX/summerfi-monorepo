# Function: isValueReference()

```ts
function isValueReference<T>(value): value is ValueReference<T>;
```

Defined in: [src/simulation/interfaces/ValueReference.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/interfaces/ValueReference.ts#L19)

Type guard that checks whether a value is a [ValueReference](../interfaces/ValueReference.md).

## Type Parameters

### T

`T`

## Parameters

### value

`unknown`

The value to test.

## Returns

`value is ValueReference<T>`

`true` if the value is a [ValueReference](../interfaces/ValueReference.md).

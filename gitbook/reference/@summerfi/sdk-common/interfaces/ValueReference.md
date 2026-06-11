# Interface: ValueReference\<T\>

Defined in: [src/simulation/interfaces/ValueReference.ts:5](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/interfaces/ValueReference.ts#L5)

A deferred reference to a value produced by an earlier simulation step, carrying an estimated
value plus the `path` used to resolve the real value at execution time.

## Type Parameters

### T

`T`

## Properties

### estimatedValue

```ts
estimatedValue: T;
```

Defined in: [src/simulation/interfaces/ValueReference.ts:6](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/interfaces/ValueReference.ts#L6)

***

### path

```ts
path: [string, string];
```

Defined in: [src/simulation/interfaces/ValueReference.ts:7](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/interfaces/ValueReference.ts#L7)

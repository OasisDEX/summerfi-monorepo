# Interface: ValueReference\<T\>

Defined in: [sdk/sdk-common/src/simulation/interfaces/ValueReference.ts:5](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/simulation/interfaces/ValueReference.ts#L5)

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

Defined in: [sdk/sdk-common/src/simulation/interfaces/ValueReference.ts:6](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/simulation/interfaces/ValueReference.ts#L6)

***

### path

```ts
path: [string, string];
```

Defined in: [sdk/sdk-common/src/simulation/interfaces/ValueReference.ts:7](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/simulation/interfaces/ValueReference.ts#L7)

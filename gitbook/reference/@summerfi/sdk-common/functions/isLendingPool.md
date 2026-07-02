# Function: isLendingPool()

```ts
function isLendingPool(maybePool): maybePool is ILendingPool;
```

Defined in: [src/lending-protocols/interfaces/ILendingPool.ts:59](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPool.ts#L59)

Type guard for ILendingPool

## Parameters

### maybePool

`unknown`

Object to be checked

## Returns

`maybePool is ILendingPool`

true if the object is an ILendingPool

It also asserts the type so that TypeScript knows that the object is an ILendingPool

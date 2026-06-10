# Function: isLendingPool()

```ts
function isLendingPool(maybePool): maybePool is ILendingPool;
```

Defined in: [sdk/sdk-common/src/lending-protocols/interfaces/ILendingPool.ts:59](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/lending-protocols/interfaces/ILendingPool.ts#L59)

## Parameters

### maybePool

`unknown`

Object to be checked

## Returns

`maybePool is ILendingPool`

true if the object is an ILendingPool

It also asserts the type so that TypeScript knows that the object is an ILendingPool

## Description

Type guard for ILendingPool

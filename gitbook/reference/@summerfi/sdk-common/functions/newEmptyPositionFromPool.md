# Function: newEmptyPositionFromPool()

```ts
function newEmptyPositionFromPool(pool): ILendingPosition;
```

Defined in: [src/common/utils/PositionUtils.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/utils/PositionUtils.ts#L18)

Creates an empty lending position (zero collateral and debt) for a given pool.

## Parameters

### pool

[`ILendingPoolData`](../type-aliases/ILendingPoolData.md)

The lending pool the position belongs to.

## Returns

[`ILendingPosition`](../interfaces/ILendingPosition.md)

A new lending position with zeroed amounts.

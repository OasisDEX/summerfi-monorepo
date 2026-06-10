# Function: borrowFromPosition()

```ts
function borrowFromPosition(position, amount): ILendingPosition;
```

Defined in: [sdk/sdk-common/src/common/utils/PositionUtils.ts:81](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/utils/PositionUtils.ts#L81)

Returns a copy of the position with the borrowed amount added to its debt.

## Parameters

### position

[`ILendingPosition`](../interfaces/ILendingPosition.md)

The position to borrow against.

### amount

[`ITokenAmount`](../interfaces/ITokenAmount.md)

The debt amount to add.

## Returns

[`ILendingPosition`](../interfaces/ILendingPosition.md)

A new position with increased debt.

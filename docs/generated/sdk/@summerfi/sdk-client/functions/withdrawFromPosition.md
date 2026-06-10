# Function: withdrawFromPosition()

```ts
function withdrawFromPosition(position, amount): ILendingPosition;
```

Defined in: [sdk/sdk-common/src/common/utils/PositionUtils.ts:60](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/utils/PositionUtils.ts#L60)

Returns a copy of the position with the withdrawn amount subtracted from its collateral.

## Parameters

### position

[`ILendingPosition`](../interfaces/ILendingPosition.md)

The position to withdraw from.

### amount

[`ITokenAmount`](../interfaces/ITokenAmount.md)

The collateral amount to remove.

## Returns

[`ILendingPosition`](../interfaces/ILendingPosition.md)

A new position with decreased collateral.

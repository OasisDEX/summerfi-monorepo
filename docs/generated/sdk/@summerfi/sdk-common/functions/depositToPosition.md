# Function: depositToPosition()

```ts
function depositToPosition(position, amount): ILendingPosition;
```

Defined in: [src/common/utils/PositionUtils.ts:39](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/utils/PositionUtils.ts#L39)

Returns a copy of the position with the deposited amount added to its collateral.

## Parameters

### position

[`ILendingPosition`](../interfaces/ILendingPosition.md)

The position to deposit into.

### amount

[`ITokenAmount`](../interfaces/ITokenAmount.md)

The collateral amount to add.

## Returns

[`ILendingPosition`](../interfaces/ILendingPosition.md)

A new position with increased collateral.

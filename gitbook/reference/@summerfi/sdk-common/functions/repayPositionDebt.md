# Function: repayPositionDebt()

```ts
function repayPositionDebt(position, amount): ILendingPosition;
```

Defined in: [src/common/utils/PositionUtils.ts:102](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/utils/PositionUtils.ts#L102)

Returns a copy of the position with the repaid amount subtracted from its debt.

## Parameters

### position

[`ILendingPosition`](../interfaces/ILendingPosition.md)

The position to repay.

### amount

[`ITokenAmount`](../interfaces/ITokenAmount.md)

The debt amount to remove.

## Returns

[`ILendingPosition`](../interfaces/ILendingPosition.md)

A new position with decreased debt.

# Function: isLendingPosition()

```ts
function isLendingPosition(maybeLendingPosition): maybeLendingPosition is ILendingPosition;
```

Defined in: [sdk/sdk-common/src/lending-protocols/interfaces/ILendingPosition.ts:61](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/lending-protocols/interfaces/ILendingPosition.ts#L61)

## Parameters

### maybeLendingPosition

`unknown`

Object to be checked

## Returns

`maybeLendingPosition is ILendingPosition`

true if the object is an ILendingPosition

It also asserts the type so that TypeScript knows that the object is an ILendingPool

## Description

Type guard for ILendingPosition

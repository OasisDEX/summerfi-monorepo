# Function: isLendingPositionId()

```ts
function isLendingPositionId(maybeLendingPositionId): maybeLendingPositionId is ILendingPositionId;
```

Defined in: [src/lending-protocols/interfaces/ILendingPositionId.ts:42](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPositionId.ts#L42)

Type guard for ILendingPositionId

## Parameters

### maybeLendingPositionId

`unknown`

Object to be checked

## Returns

`maybeLendingPositionId is ILendingPositionId`

true if the object is an ILendingPositionId

It also asserts the type so that TypeScript knows that the object is an ILendingPool

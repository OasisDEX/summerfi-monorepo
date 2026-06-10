# Function: isLendingPoolId()

```ts
function isLendingPoolId(maybePoolId): maybePoolId is ILendingPoolId;
```

Defined in: [sdk/sdk-common/src/lending-protocols/interfaces/ILendingPoolId.ts:52](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/lending-protocols/interfaces/ILendingPoolId.ts#L52)

## Parameters

### maybePoolId

`unknown`

Object to be checked

## Returns

`maybePoolId is ILendingPoolId`

true if the object is an ILendingPoolId

It also asserts the type so that TypeScript knows that the object is an ILendingPoolId

## Description

Type guard for ILendingPoolId

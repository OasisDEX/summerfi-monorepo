# Function: isLendingPoolInfo()

```ts
function isLendingPoolInfo(maybePool): maybePool is ILendingPoolInfo;
```

Defined in: [../sdk-common/src/lending-protocols/interfaces/ILendingPoolInfo.ts:62](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPoolInfo.ts#L62)

## Parameters

### maybePool

`unknown`

Object to be checked

## Returns

`maybePool is ILendingPoolInfo`

true if the object is an ILendingPool

It also asserts the type so that TypeScript knows that the object is an ILendingPool

## Description

Type guard for ILendingPoolInfo

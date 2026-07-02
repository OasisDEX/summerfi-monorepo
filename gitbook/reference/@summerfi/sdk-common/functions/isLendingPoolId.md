# Function: isLendingPoolId()

```ts
function isLendingPoolId(maybePoolId): maybePoolId is ILendingPoolId;
```

Defined in: [src/lending-protocols/interfaces/ILendingPoolId.ts:52](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPoolId.ts#L52)

Type guard for ILendingPoolId

## Parameters

### maybePoolId

`unknown`

Object to be checked

## Returns

`maybePoolId is ILendingPoolId`

true if the object is an ILendingPoolId

It also asserts the type so that TypeScript knows that the object is an ILendingPoolId

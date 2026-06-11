# Function: isTokenAmount()

```ts
function isTokenAmount(maybeTokenAmount, returnedErrors?): maybeTokenAmount is ITokenAmount;
```

Defined in: [../sdk-common/src/common/interfaces/ITokenAmount.ts:146](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/ITokenAmount.ts#L146)

## Parameters

### maybeTokenAmount

`unknown`

The value to check

### returnedErrors?

`string`[]

Optional array that, on failure, is populated with validation error messages

## Returns

`maybeTokenAmount is ITokenAmount`

true if the object is an ITokenAmount

## Description

Type guard for ITokenAmount

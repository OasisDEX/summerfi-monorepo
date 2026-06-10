# Function: isPercentage()

```ts
function isPercentage(maybePercentage, returnedErrors?): maybePercentage is IPercentage;
```

Defined in: [src/common/interfaces/IPercentage.ts:83](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPercentage.ts#L83)

## Parameters

### maybePercentage

`unknown`

The value to check

### returnedErrors?

`string`[]

Optional array that, on failure, is populated with validation error messages

## Returns

`maybePercentage is IPercentage`

true if the object is an IPercentage

## Description

Type guard for IPercentage

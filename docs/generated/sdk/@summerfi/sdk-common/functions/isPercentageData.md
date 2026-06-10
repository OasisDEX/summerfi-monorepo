# Function: isPercentageData()

```ts
function isPercentageData(maybePercentageData, returnedErrors?): maybePercentageData is Readonly<{ value: number }>;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IPercentage.ts:96](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/interfaces/IPercentage.ts#L96)

## Parameters

### maybePercentageData

`unknown`

The value to check

### returnedErrors?

`string`[]

Optional array that, on failure, is populated with validation error messages

## Returns

`maybePercentageData is Readonly<{ value: number }>`

true if the object is an IPercentageData

## Description

Type guard for IPercentageData

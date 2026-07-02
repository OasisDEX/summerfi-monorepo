# Function: isPercentageData()

```ts
function isPercentageData(maybePercentageData, returnedErrors?): maybePercentageData is Readonly<{ value: number }>;
```

Defined in: [../sdk-common/src/common/interfaces/IPercentage.ts:91](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPercentage.ts#L91)

Type guard for IPercentageData

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

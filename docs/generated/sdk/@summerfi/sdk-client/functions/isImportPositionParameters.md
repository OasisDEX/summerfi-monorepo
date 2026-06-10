# Function: isImportPositionParameters()

```ts
function isImportPositionParameters(maybeImportPositionParameters): maybeImportPositionParameters is Readonly<{ externalPosition: IExternalLendingPosition }>;
```

Defined in: [sdk/sdk-common/src/orders/importing/interfaces/IImportPositionParameters.ts:39](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/orders/importing/interfaces/IImportPositionParameters.ts#L39)

## Parameters

### maybeImportPositionParameters

`unknown`

## Returns

`maybeImportPositionParameters is Readonly<{ externalPosition: IExternalLendingPosition }>`

true if the object is an IImportPositionParameters

## Description

Type guard for IImportPositionParameters

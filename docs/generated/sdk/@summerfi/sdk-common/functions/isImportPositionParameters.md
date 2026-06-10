# Function: isImportPositionParameters()

```ts
function isImportPositionParameters(maybeImportPositionParameters): maybeImportPositionParameters is Readonly<{ externalPosition: IExternalLendingPosition }>;
```

Defined in: [sdk/sdk-common/src/orders/importing/interfaces/IImportPositionParameters.ts:39](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/orders/importing/interfaces/IImportPositionParameters.ts#L39)

## Parameters

### maybeImportPositionParameters

`unknown`

## Returns

`maybeImportPositionParameters is Readonly<{ externalPosition: IExternalLendingPosition }>`

true if the object is an IImportPositionParameters

## Description

Type guard for IImportPositionParameters

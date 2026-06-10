# Function: isArmadaPositionId()

```ts
function isArmadaPositionId(maybeArmadaPositionId, returnedErrors?): maybeArmadaPositionId is IArmadaPositionId;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IArmadaPositionId.ts:45](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/interfaces/IArmadaPositionId.ts#L45)

## Parameters

### maybeArmadaPositionId

`unknown`

Object to be checked

### returnedErrors?

`string`[]

Optional array that, on failure, is populated with validation error messages

## Returns

`maybeArmadaPositionId is IArmadaPositionId`

true if the object is a IArmadaPositionId

## Description

Type guard for IArmadaPositionId

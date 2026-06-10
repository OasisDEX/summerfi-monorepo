# Function: isArmadaVaultId()

```ts
function isArmadaVaultId(maybeArmadaVaultId, returnedErrors?): maybeArmadaVaultId is IArmadaVaultId;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IArmadaVaultId.ts:52](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/interfaces/IArmadaVaultId.ts#L52)

## Parameters

### maybeArmadaVaultId

`unknown`

Object to be checked

### returnedErrors?

`string`[]

Optional array that, on failure, is populated with validation error messages

## Returns

`maybeArmadaVaultId is IArmadaVaultId`

true if the object is a IMakerLendingPosition

## Description

Type guard for IArmadaVaultId

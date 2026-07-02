# Function: isArmadaVaultId()

```ts
function isArmadaVaultId(maybeArmadaVaultId, returnedErrors?): maybeArmadaVaultId is IArmadaVaultId;
```

Defined in: [src/common/interfaces/IArmadaVaultId.ts:52](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaVaultId.ts#L52)

Type guard for IArmadaVaultId

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

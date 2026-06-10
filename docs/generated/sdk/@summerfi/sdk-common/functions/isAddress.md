# Function: isAddress()

```ts
function isAddress(maybeAddress, returnedErrors?): maybeAddress is IAddress;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IAddress.ts:57](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/IAddress.ts#L57)

## Parameters

### maybeAddress

`unknown`

The value to check

### returnedErrors?

`string`[]

Optional array that, on failure, is populated with validation error messages

## Returns

`maybeAddress is IAddress`

true if the object is an IAddress

## Description

Type guard for IAddress

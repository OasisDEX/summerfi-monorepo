# Function: isAddress()

```ts
function isAddress(maybeAddress, returnedErrors?): maybeAddress is IAddress;
```

Defined in: [src/common/interfaces/IAddress.ts:57](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IAddress.ts#L57)

Type guard for IAddress

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

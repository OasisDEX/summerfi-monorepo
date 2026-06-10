# Function: isUser()

```ts
function isUser(maybeUser, returnedErrors?): maybeUser is IUser;
```

Defined in: [sdk/sdk-common/src/user/interfaces/IUser.ts:42](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/user/interfaces/IUser.ts#L42)

Type guard for IUser

## Parameters

### maybeUser

`unknown`

Object to be checked

### returnedErrors?

`string`[]

Optional array that, on failure, is populated with validation error messages

## Returns

`maybeUser is IUser`

true if the object is an IUser

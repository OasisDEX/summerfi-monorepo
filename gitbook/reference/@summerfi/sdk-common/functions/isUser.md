# Function: isUser()

```ts
function isUser(maybeUser, returnedErrors?): maybeUser is IUser;
```

Defined in: [src/user/interfaces/IUser.ts:42](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/user/interfaces/IUser.ts#L42)

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

# Function: isChainInfo()

```ts
function isChainInfo(maybeChainInfo, returnedErrors?): maybeChainInfo is IChainInfo;
```

Defined in: [../sdk-common/src/common/interfaces/IChainInfo.ts:52](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IChainInfo.ts#L52)

## Parameters

### maybeChainInfo

`unknown`

The value to check

### returnedErrors?

`string`[]

Optional array that, on failure, is populated with validation error messages

## Returns

`maybeChainInfo is IChainInfo`

true if the object is an IChainInfo

## Description

Type guard for IChainInfo

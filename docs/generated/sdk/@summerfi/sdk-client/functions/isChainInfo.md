# Function: isChainInfo()

```ts
function isChainInfo(maybeChainInfo, returnedErrors?): maybeChainInfo is IChainInfo;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IChainInfo.ts:52](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/interfaces/IChainInfo.ts#L52)

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

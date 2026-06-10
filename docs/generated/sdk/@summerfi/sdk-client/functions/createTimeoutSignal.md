# Function: createTimeoutSignal()

```ts
function createTimeoutSignal(timeout): AbortSignal;
```

Defined in: [sdk/sdk-common/src/configs/fetch.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/configs/fetch.ts#L20)

Creates an AbortSignal with the standard timeout

## Parameters

### timeout

`number` = `FETCH_CONFIG.TIMEOUT`

Timeout in milliseconds (defaults to standard timeout)

## Returns

`AbortSignal`

AbortSignal that will abort after the specified timeout

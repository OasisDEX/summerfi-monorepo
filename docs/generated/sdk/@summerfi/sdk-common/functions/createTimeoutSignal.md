# Function: createTimeoutSignal()

```ts
function createTimeoutSignal(timeout): AbortSignal;
```

Defined in: [sdk/sdk-common/src/configs/fetch.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/configs/fetch.ts#L20)

Creates an AbortSignal with the standard timeout

## Parameters

### timeout

`number` = `FETCH_CONFIG.TIMEOUT`

Timeout in milliseconds (defaults to standard timeout)

## Returns

`AbortSignal`

AbortSignal that will abort after the specified timeout

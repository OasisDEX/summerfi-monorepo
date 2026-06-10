# Function: fetchWithTimeout()

```ts
function fetchWithTimeout(url, options?): Promise<Response>;
```

Defined in: [sdk/sdk-common/src/configs/fetch.ts:31](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/configs/fetch.ts#L31)

Performs a `fetch` that aborts after the SDK's standard timeout ([FETCH\_CONFIG.TIMEOUT](../variables/FETCH_CONFIG.md#timeout)).

## Parameters

### url

`string`

The URL to request.

### options?

`RequestInit`

Optional `fetch` request options (merged with the timeout abort signal).

## Returns

`Promise`\<`Response`\>

The `fetch` response promise.

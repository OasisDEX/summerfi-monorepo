# Function: fetchWithTimeout()

```ts
function fetchWithTimeout(url, options?): Promise<Response>;
```

Defined in: [sdk/sdk-common/src/configs/fetch.ts:31](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/configs/fetch.ts#L31)

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

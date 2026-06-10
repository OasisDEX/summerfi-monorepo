# Function: makeSDK()

```ts
function makeSDK(params): SDKManager;
```

Defined in: [sdk/sdk-client/src/implementation/MakeSDK.ts:29](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-client/src/implementation/MakeSDK.ts#L29)

Creates a public Summer.fi SDK client ([SDKManager](../classes/SDKManager.md)).

Accepts either an `apiDomainUrl` or a direct `apiURL`, plus an optional `logging` flag and API
`version`. Prefer `apiDomainUrl`, which enables automatic versioning and routing based on the
client version.

## Parameters

### params

`MakeSDKParams`

Connection options: `apiDomainUrl` or `apiURL`, optional `version` and `logging`.

## Returns

[`SDKManager`](../classes/SDKManager.md)

A configured [SDKManager](../classes/SDKManager.md) instance.

## Throws

Error if neither `apiDomainUrl` nor `apiURL` is provided.

## Example

```ts
const sdk = makeSDK({ apiDomainUrl: 'https://summer.fi' })
const chains = await sdk.chains.getSupportedChains()
```

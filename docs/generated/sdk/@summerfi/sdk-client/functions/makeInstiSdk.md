# Function: makeInstiSdk()

```ts
function makeInstiSdk(params): SDKAdminManager;
```

Defined in: [sdk/sdk-client/src/implementation/MakeInstiSDK.ts:30](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-client/src/implementation/MakeInstiSDK.ts#L30)

Creates an institutional Summer.fi SDK client ([SDKInstiManager](../classes/SDKAdminManager.md)) scoped to an institution.

Behaves like [makeAdminSDK](makeAdminSDK.md) (sending `clientId` as the `Client-Id` header) but additionally
forwards an institutional deployment-config version as the `Insti-Version` header (defaults to
`'v2'`), which the server uses to resolve the institution's deployment config and access manager.

## Parameters

### params

[`MakeInstiSDKParams`](../type-aliases/MakeInstiSDKParams.md)

[MakeInstiSDKParams](../type-aliases/MakeInstiSDKParams.md): standard connection options, `clientId`, and an
  optional `instiVersion` (defaults to `'v2'`).

## Returns

[`SDKAdminManager`](../classes/SDKAdminManager.md)

A configured [SDKInstiManager](../classes/SDKAdminManager.md) instance.

## Throws

Error if neither `apiDomainUrl` nor `apiURL` is provided.

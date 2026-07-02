# Function: makeAdminSDK()

```ts
function makeAdminSDK(params): SDKAdminManager;
```

Defined in: [src/implementation/MakeAdminSDK.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/MakeAdminSDK.ts#L19)

Creates a managed (admin) Summer.fi SDK client ([SDKInstiManager](../classes/SDKAdminManager.md)) scoped to a client id.

Behaves like [makeSDK](makeSDK.md) but forwards the `clientId` as the `Client-Id` header, unlocking the
admin/access-control surface. Accepts either an `apiDomainUrl` or a direct `apiURL`; prefer
`apiDomainUrl` for automatic versioning and routing.

## Parameters

### params

[`MakeAdminSDKParams`](../type-aliases/MakeAdminSDKParams.md)

[MakeSDKParams](../type-aliases/MakeSDKParams.md) connection options plus the `clientId` to authenticate as.

## Returns

[`SDKAdminManager`](../classes/SDKAdminManager.md)

A configured [SDKInstiManager](../classes/SDKAdminManager.md) instance.

## Throws

Error if neither `apiDomainUrl` nor `apiURL` is provided.

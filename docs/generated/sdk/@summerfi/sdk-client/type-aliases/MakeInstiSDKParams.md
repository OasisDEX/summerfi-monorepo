# Type Alias: MakeInstiSDKParams

```ts
type MakeInstiSDKParams = MakeSDKParams & object;
```

Defined in: [sdk/sdk-client/src/implementation/MakeInstiSDK.ts:12](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-client/src/implementation/MakeInstiSDK.ts#L12)

Institutional deployment-config version. Selects how the server resolves the institution's
deployment config (chains + access manager): 'v1' = legacy institutions subgraph, 'v2' = RWA /
institutions-v2 subgraph. Sent as the `Insti-Version` header.

## Type Declaration

### clientId

```ts
clientId: string;
```

### instiVersion?

```ts
optional instiVersion: InstiVersion;
```

Defaults to 'v2'.

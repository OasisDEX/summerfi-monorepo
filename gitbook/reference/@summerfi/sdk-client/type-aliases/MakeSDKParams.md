# Type Alias: MakeSDKParams

```ts
type MakeSDKParams = object & 
  | {
  apiDomainUrl: string;
}
  | {
  apiURL: string;
};
```

Defined in: [src/implementation/MakeSDK.ts:7](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/MakeSDK.ts#L7)

## Type Declaration

### logging?

```ts
optional logging: boolean;
```

### version?

```ts
optional version: SDKApiVersion;
```

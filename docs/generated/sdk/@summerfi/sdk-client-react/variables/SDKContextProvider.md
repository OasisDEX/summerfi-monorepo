# Variable: SDKContextProvider

```ts
const SDKContextProvider: Provider<Partial<SDKContextType>> = SDKContext.Provider;
```

Defined in: [sdk/sdk-client-react/src/components/SDKContext.ts:12](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client-react/src/components/SDKContext.ts#L12)

React context provider that supplies the SDK configuration (such as `apiURL`) to descendant
components; consumers should read it via [useSDKContext](../functions/useSDKContext.md) rather than this provider directly.

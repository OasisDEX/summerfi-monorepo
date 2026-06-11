# Variable: SDKContextProvider

```ts
const SDKContextProvider: Provider<Partial<SDKContextType>> = SDKContext.Provider;
```

Defined in: [src/components/SDKContext.ts:12](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/components/SDKContext.ts#L12)

React context provider that supplies the SDK configuration (such as `apiURL`) to descendant
components; consumers should read it via [useSDKContext](../functions/useSDKContext.md) rather than this provider directly.

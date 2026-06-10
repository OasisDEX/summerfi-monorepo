# Function: useSDKContext()

```ts
function useSDKContext(): object;
```

Defined in: [sdk/sdk-client-react/src/components/SDKContext.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-client-react/src/components/SDKContext.ts#L25)

Reads the SDK configuration from the surrounding [SDKContextProvider](../variables/SDKContextProvider.md).

## Returns

`object`

The initialized SDK context value containing the configured `apiURL`.

### apiURL

```ts
apiURL: string;
```

## Throws

Error if used outside of an initialized provider (i.e. when `apiURL` is missing).

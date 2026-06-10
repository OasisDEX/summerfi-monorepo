# Function: useSDKContext()

```ts
function useSDKContext(): object;
```

Defined in: [src/components/SDKContext.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/components/SDKContext.ts#L25)

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

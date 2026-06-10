# Function: SDKProvider()

```ts
function SDKProvider(props): Element;
```

Defined in: [sdk/sdk-client-react/src/components/SDKProvider.tsx:13](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client-react/src/components/SDKProvider.tsx#L13)

Top-level provider that makes the SDK configuration available to all descendant components,
enabling the [useSDK](useSDK.md) and [useSDKContext](useSDKContext.md) hooks to resolve their context.

## Parameters

### props

Component props.

#### apiURL

`string`

Base URL of the Summer.fi SDK API endpoint to target.

#### children

`ReactNode`

The React subtree that should have access to the SDK context.

## Returns

`Element`

A context provider element wrapping `children`.

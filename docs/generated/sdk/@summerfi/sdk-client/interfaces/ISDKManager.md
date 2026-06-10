# Interface: ISDKManager

Defined in: [src/interfaces/ISDKManager.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ISDKManager.ts#L16)

SDKManager is the main entry point for interacting with the SDK in the client side

It contains all the available services that can be used to interact with the SDK

## Extended by

- [`ISDKInstiManager`](ISDKInstiManager.md)

## Properties

### allowance

```ts
readonly allowance: IAllowanceManagerClient;
```

Defined in: [src/interfaces/ISDKManager.ts:32](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ISDKManager.ts#L32)

Allowance Manager Client for Permit2 authorization checks, transactions and typed data

***

### armada

```ts
readonly armada: IArmadaManagerClient;
```

Defined in: [src/interfaces/ISDKManager.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ISDKManager.ts#L24)

Armada Manager for interacting with the Armada protocol

***

### chains

```ts
readonly chains: IChainsManagerClient;
```

Defined in: [src/interfaces/ISDKManager.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ISDKManager.ts#L18)

Chains Manager for interacting with the different chains supported in the SDK

***

### dca

```ts
readonly dca: IDcaManagerClient;
```

Defined in: [src/interfaces/ISDKManager.ts:34](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ISDKManager.ts#L34)

DCA Manager for interacting with DCA strategies and buy orders

***

### intentSwaps

```ts
readonly intentSwaps: IIntentSwapClient;
```

Defined in: [src/interfaces/ISDKManager.ts:30](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ISDKManager.ts#L30)

Intent Swap Client for interacting with CoW Protocol intent swaps

***

### oracle

```ts
readonly oracle: IOracleManagerClient;
```

Defined in: [src/interfaces/ISDKManager.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ISDKManager.ts#L28)

Swap Manager for interacting with the swaps

***

### swaps

```ts
readonly swaps: ISwapManagerClient;
```

Defined in: [src/interfaces/ISDKManager.ts:26](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ISDKManager.ts#L26)

Swap Manager for interacting with the swaps

***

### tokens

```ts
readonly tokens: ITokensManagerClient2;
```

Defined in: [src/interfaces/ISDKManager.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ISDKManager.ts#L20)

Tokens Manager for interacting with the different tokens supported in the SDK

***

### users

```ts
readonly users: IUsersManager;
```

Defined in: [src/interfaces/ISDKManager.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/ISDKManager.ts#L22)

Users Manager for retrieving information about a user

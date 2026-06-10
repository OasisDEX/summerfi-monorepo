# Class: SDKManager

Defined in: [sdk/sdk-client/src/implementation/SDKManager.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/implementation/SDKManager.ts#L14)

## See

ISDKManager

## Implements

- [`ISDKManager`](../interfaces/ISDKManager.md)

## Constructors

### Constructor

```ts
new SDKManager(params): SDKManager;
```

Defined in: [sdk/sdk-client/src/implementation/SDKManager.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/implementation/SDKManager.ts#L25)

#### Parameters

##### params

###### rpcClient

`TRPCClient`

#### Returns

`SDKManager`

## Properties

### allowance

```ts
readonly allowance: AllowanceManagerClient;
```

Defined in: [sdk/sdk-client/src/implementation/SDKManager.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/implementation/SDKManager.ts#L23)

Allowance Manager Client for Permit2 authorization checks, transactions and typed data

#### Implementation of

[`ISDKManager`](../interfaces/ISDKManager.md).[`allowance`](../interfaces/ISDKManager.md#allowance)

***

### armada

```ts
readonly armada: ArmadaManagerClient;
```

Defined in: [sdk/sdk-client/src/implementation/SDKManager.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/implementation/SDKManager.ts#L19)

Armada Manager for interacting with the Armada protocol

#### Implementation of

[`ISDKManager`](../interfaces/ISDKManager.md).[`armada`](../interfaces/ISDKManager.md#armada)

***

### chains

```ts
readonly chains: ChainsManagerClient;
```

Defined in: [sdk/sdk-client/src/implementation/SDKManager.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/implementation/SDKManager.ts#L15)

Chains Manager for interacting with the different chains supported in the SDK

#### Implementation of

[`ISDKManager`](../interfaces/ISDKManager.md).[`chains`](../interfaces/ISDKManager.md#chains)

***

### dca

```ts
readonly dca: DcaManagerClient;
```

Defined in: [sdk/sdk-client/src/implementation/SDKManager.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/implementation/SDKManager.ts#L18)

DCA Manager for interacting with DCA strategies and buy orders

#### Implementation of

[`ISDKManager`](../interfaces/ISDKManager.md).[`dca`](../interfaces/ISDKManager.md#dca)

***

### intentSwaps

```ts
readonly intentSwaps: IntentSwapClient;
```

Defined in: [sdk/sdk-client/src/implementation/SDKManager.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/implementation/SDKManager.ts#L22)

Intent Swap Client for interacting with CoW Protocol intent swaps

#### Implementation of

[`ISDKManager`](../interfaces/ISDKManager.md).[`intentSwaps`](../interfaces/ISDKManager.md#intentswaps)

***

### oracle

```ts
readonly oracle: OracleManagerClient;
```

Defined in: [sdk/sdk-client/src/implementation/SDKManager.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/implementation/SDKManager.ts#L21)

Swap Manager for interacting with the swaps

#### Implementation of

[`ISDKManager`](../interfaces/ISDKManager.md).[`oracle`](../interfaces/ISDKManager.md#oracle)

***

### swaps

```ts
readonly swaps: SwapManagerClient;
```

Defined in: [sdk/sdk-client/src/implementation/SDKManager.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/implementation/SDKManager.ts#L20)

Swap Manager for interacting with the swaps

#### Implementation of

[`ISDKManager`](../interfaces/ISDKManager.md).[`swaps`](../interfaces/ISDKManager.md#swaps)

***

### tokens

```ts
readonly tokens: TokensManagerClient2;
```

Defined in: [sdk/sdk-client/src/implementation/SDKManager.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/implementation/SDKManager.ts#L16)

Tokens Manager for interacting with the different tokens supported in the SDK

#### Implementation of

[`ISDKManager`](../interfaces/ISDKManager.md).[`tokens`](../interfaces/ISDKManager.md#tokens)

***

### users

```ts
readonly users: UsersManager;
```

Defined in: [sdk/sdk-client/src/implementation/SDKManager.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/implementation/SDKManager.ts#L17)

Users Manager for retrieving information about a user

#### Implementation of

[`ISDKManager`](../interfaces/ISDKManager.md).[`users`](../interfaces/ISDKManager.md#users)

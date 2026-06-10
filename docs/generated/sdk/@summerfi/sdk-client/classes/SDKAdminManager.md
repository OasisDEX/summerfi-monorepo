# Class: SDKAdminManager

Defined in: [sdk/sdk-client/src/implementation/SDKInstiManager.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/implementation/SDKInstiManager.ts#L15)

## See

ISDKInstiManager

## Implements

- [`ISDKInstiManager`](../interfaces/ISDKInstiManager.md)

## Constructors

### Constructor

```ts
new SDKAdminManager(params): SDKInstiManager;
```

Defined in: [sdk/sdk-client/src/implementation/SDKInstiManager.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/implementation/SDKInstiManager.ts#L27)

#### Parameters

##### params

###### rpcClient

`TRPCClient`

#### Returns

`SDKInstiManager`

## Properties

### allowance

```ts
readonly allowance: AllowanceManagerClient;
```

Defined in: [sdk/sdk-client/src/implementation/SDKInstiManager.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/implementation/SDKInstiManager.ts#L23)

Allowance Manager Client for Permit2 authorization checks, transactions and typed data

#### Implementation of

[`ISDKInstiManager`](../interfaces/ISDKInstiManager.md).[`allowance`](../interfaces/ISDKInstiManager.md#allowance)

***

### armada

```ts
readonly armada: ArmadaManagerClient;
```

Defined in: [sdk/sdk-client/src/implementation/SDKInstiManager.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/implementation/SDKInstiManager.ts#L19)

Armada Manager for interacting with the Armada protocol

#### Implementation of

[`ISDKInstiManager`](../interfaces/ISDKInstiManager.md).[`armada`](../interfaces/ISDKInstiManager.md#armada)

***

### chains

```ts
readonly chains: ChainsManagerClient;
```

Defined in: [sdk/sdk-client/src/implementation/SDKInstiManager.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/implementation/SDKInstiManager.ts#L16)

Chains Manager for interacting with the different chains supported in the SDK

#### Implementation of

[`ISDKInstiManager`](../interfaces/ISDKInstiManager.md).[`chains`](../interfaces/ISDKInstiManager.md#chains)

***

### dca

```ts
readonly dca: DcaManagerClient;
```

Defined in: [sdk/sdk-client/src/implementation/SDKInstiManager.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/implementation/SDKInstiManager.ts#L24)

DCA Manager for interacting with DCA strategies and buy orders

#### Implementation of

[`ISDKInstiManager`](../interfaces/ISDKInstiManager.md).[`dca`](../interfaces/ISDKInstiManager.md#dca)

***

### intentSwaps

```ts
readonly intentSwaps: IntentSwapClient;
```

Defined in: [sdk/sdk-client/src/implementation/SDKInstiManager.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/implementation/SDKInstiManager.ts#L22)

Intent Swap Client for interacting with CoW Protocol intent swaps

#### Implementation of

[`ISDKInstiManager`](../interfaces/ISDKInstiManager.md).[`intentSwaps`](../interfaces/ISDKInstiManager.md#intentswaps)

***

### oracle

```ts
readonly oracle: OracleManagerClient;
```

Defined in: [sdk/sdk-client/src/implementation/SDKInstiManager.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/implementation/SDKInstiManager.ts#L21)

Swap Manager for interacting with the swaps

#### Implementation of

[`ISDKInstiManager`](../interfaces/ISDKInstiManager.md).[`oracle`](../interfaces/ISDKInstiManager.md#oracle)

***

### rwa

```ts
readonly rwa: RwaManagerClient;
```

Defined in: [sdk/sdk-client/src/implementation/SDKInstiManager.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/implementation/SDKInstiManager.ts#L25)

RWA Manager for interacting with Real-World Asset vaults

#### Implementation of

[`ISDKInstiManager`](../interfaces/ISDKInstiManager.md).[`rwa`](../interfaces/ISDKInstiManager.md#rwa)

***

### swaps

```ts
readonly swaps: SwapManagerClient;
```

Defined in: [sdk/sdk-client/src/implementation/SDKInstiManager.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/implementation/SDKInstiManager.ts#L20)

Swap Manager for interacting with the swaps

#### Implementation of

[`ISDKInstiManager`](../interfaces/ISDKInstiManager.md).[`swaps`](../interfaces/ISDKInstiManager.md#swaps)

***

### tokens

```ts
readonly tokens: TokensManagerClient2;
```

Defined in: [sdk/sdk-client/src/implementation/SDKInstiManager.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/implementation/SDKInstiManager.ts#L17)

Tokens Manager for interacting with the different tokens supported in the SDK

#### Implementation of

[`ISDKInstiManager`](../interfaces/ISDKInstiManager.md).[`tokens`](../interfaces/ISDKInstiManager.md#tokens)

***

### users

```ts
readonly users: UsersManager;
```

Defined in: [sdk/sdk-client/src/implementation/SDKInstiManager.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/implementation/SDKInstiManager.ts#L18)

Users Manager for retrieving information about a user

#### Implementation of

[`ISDKInstiManager`](../interfaces/ISDKInstiManager.md).[`users`](../interfaces/ISDKInstiManager.md#users)

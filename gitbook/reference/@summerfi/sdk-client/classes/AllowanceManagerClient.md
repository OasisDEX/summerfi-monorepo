# Class: AllowanceManagerClient

Defined in: [src/implementation/AllowanceManagerClient.ts:8](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/AllowanceManagerClient.ts#L8)

Thin client over the server allowance manager Permit2 procedures

## Extends

- `IRPCClient`

## Implements

- [`IAllowanceManagerClient`](../interfaces/IAllowanceManagerClient.md)

## Constructors

### Constructor

```ts
new AllowanceManagerClient(params): AllowanceManagerClient;
```

Defined in: [src/implementation/AllowanceManagerClient.ts:9](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/AllowanceManagerClient.ts#L9)

#### Parameters

##### params

###### rpcClient

`TRPCClient`

#### Returns

`AllowanceManagerClient`

#### Overrides

```ts
IRPCClient.constructor
```

## Properties

### getApproval()

```ts
getApproval: (params) => Promise<
  | ApproveTransactionInfo
| undefined>;
```

Defined in: [src/implementation/AllowanceManagerClient.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/AllowanceManagerClient.ts#L14)

Get the transaction needed to set an ERC-20 allowance for a spender, or undefined
if the owner already has a sufficient allowance (owner must be provided for that check).

#### Parameters

##### params

###### amount

[`ITokenAmount`](../interfaces/ITokenAmount.md)

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### owner?

`` `0x${string}` ``

###### spender

`` `0x${string}` ``

#### Returns

`Promise`\<
  \| [`ApproveTransactionInfo`](../type-aliases/ApproveTransactionInfo.md)
  \| `undefined`\>

#### See

IAllowanceManagerClient.getApproval

#### Implementation of

[`IAllowanceManagerClient`](../interfaces/IAllowanceManagerClient.md).[`getApproval`](../interfaces/IAllowanceManagerClient.md#getapproval)

***

### getPermit2AuthorizationTx()

```ts
getPermit2AuthorizationTx: (params) => Promise<[Permit2AuthorizationTransactionInfo]>;
```

Defined in: [src/implementation/AllowanceManagerClient.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/AllowanceManagerClient.ts#L23)

Creates a transaction to authorize the Permit2 contract to spend a specific token

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### tokenAddress

`` `0x${string}` ``

#### Returns

`Promise`\<\[[`Permit2AuthorizationTransactionInfo`](../type-aliases/Permit2AuthorizationTransactionInfo.md)\]\>

#### See

IAllowanceManagerClient.getPermit2AuthorizationTx

#### Implementation of

[`IAllowanceManagerClient`](../interfaces/IAllowanceManagerClient.md).[`getPermit2AuthorizationTx`](../interfaces/IAllowanceManagerClient.md#getpermit2authorizationtx)

***

### getPermit2Data()

```ts
getPermit2Data: (params) => Promise<{
  permitData: Permit2PermitData;
  signTypedDataParameters: SignTypedDataParameters;
}>;
```

Defined in: [src/implementation/AllowanceManagerClient.ts:31](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/AllowanceManagerClient.ts#L31)

Builds the EIP-712 typed data for a PermitTransferFrom operation, ready to be signed by the caller

#### Parameters

##### params

###### amount

`bigint`

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### senderAddress

`` `0x${string}` ``

###### spenderAddress

`` `0x${string}` ``

###### tokenAddress

`` `0x${string}` ``

#### Returns

`Promise`\<\{
  `permitData`: [`Permit2PermitData`](../type-aliases/Permit2PermitData.md);
  `signTypedDataParameters`: [`SignTypedDataParameters`](https://viem.sh/docs/);
\}\>

#### See

IAllowanceManagerClient.getPermit2Data

#### Implementation of

[`IAllowanceManagerClient`](../interfaces/IAllowanceManagerClient.md).[`getPermit2Data`](../interfaces/IAllowanceManagerClient.md#getpermit2data)

***

### getPermit2RevokeTx()

```ts
getPermit2RevokeTx: (params) => Promise<[Permit2RevokeTransactionInfo]>;
```

Defined in: [src/implementation/AllowanceManagerClient.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/AllowanceManagerClient.ts#L27)

Creates a transaction to revoke the Permit2 contract authorization for a specific token

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### tokenAddress

`` `0x${string}` ``

#### Returns

`Promise`\<\[[`Permit2RevokeTransactionInfo`](../type-aliases/Permit2RevokeTransactionInfo.md)\]\>

#### See

IAllowanceManagerClient.getPermit2RevokeTx

#### Implementation of

[`IAllowanceManagerClient`](../interfaces/IAllowanceManagerClient.md).[`getPermit2RevokeTx`](../interfaces/IAllowanceManagerClient.md#getpermit2revoketx)

***

### isPermit2AuthorizationNeeded()

```ts
isPermit2AuthorizationNeeded: (params) => Promise<boolean>;
```

Defined in: [src/implementation/AllowanceManagerClient.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/implementation/AllowanceManagerClient.ts#L18)

Checks if the Permit2 contract needs authorization for a specific token and amount

#### Parameters

##### params

###### amount

`bigint`

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### ownerAddress

`` `0x${string}` ``

###### tokenAddress

`` `0x${string}` ``

#### Returns

`Promise`\<`boolean`\>

#### See

IAllowanceManagerClient.isPermit2AuthorizationNeeded

#### Implementation of

[`IAllowanceManagerClient`](../interfaces/IAllowanceManagerClient.md).[`isPermit2AuthorizationNeeded`](../interfaces/IAllowanceManagerClient.md#ispermit2authorizationneeded)

## Accessors

### rpcClient

#### Get Signature

```ts
get protected rpcClient(): TRPCClient;
```

Defined in: [src/interfaces/IRPCClient.ts:10](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IRPCClient.ts#L10)

##### Returns

`TRPCClient`

#### Inherited from

```ts
IRPCClient.rpcClient
```

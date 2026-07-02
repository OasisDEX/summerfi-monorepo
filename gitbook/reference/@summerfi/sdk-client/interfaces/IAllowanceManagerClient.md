# Interface: IAllowanceManagerClient

Defined in: [src/interfaces/IAllowanceManagerClient.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IAllowanceManagerClient.ts#L16)

Client-side surface for the allowance manager. Every method is a thin wrapper over a
server tRPC procedure — all logic and onchain reads happen server-side.

## Methods

### getApproval()

```ts
getApproval(params): Promise<
  | ApproveTransactionInfo
| undefined>;
```

Defined in: [src/interfaces/IAllowanceManagerClient.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IAllowanceManagerClient.ts#L21)

Get the transaction needed to set an ERC-20 allowance for a spender, or undefined
if the owner already has a sufficient allowance (owner must be provided for that check).

#### Parameters

##### params

###### amount

[`ITokenAmount`](ITokenAmount.md)

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

***

### getPermit2AuthorizationTx()

```ts
getPermit2AuthorizationTx(params): Promise<[Permit2AuthorizationTransactionInfo]>;
```

Defined in: [src/interfaces/IAllowanceManagerClient.ts:41](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IAllowanceManagerClient.ts#L41)

Creates a transaction to authorize the Permit2 contract to spend a specific token

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### tokenAddress

`` `0x${string}` ``

#### Returns

`Promise`\<\[[`Permit2AuthorizationTransactionInfo`](../type-aliases/Permit2AuthorizationTransactionInfo.md)\]\>

***

### getPermit2Data()

```ts
getPermit2Data(params): Promise<{
  permitData: Permit2PermitData;
  signTypedDataParameters: SignTypedDataParameters;
}>;
```

Defined in: [src/interfaces/IAllowanceManagerClient.ts:57](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IAllowanceManagerClient.ts#L57)

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
  `signTypedDataParameters`: `SignTypedDataParameters`;
\}\>

***

### getPermit2RevokeTx()

```ts
getPermit2RevokeTx(params): Promise<[Permit2RevokeTransactionInfo]>;
```

Defined in: [src/interfaces/IAllowanceManagerClient.ts:49](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IAllowanceManagerClient.ts#L49)

Creates a transaction to revoke the Permit2 contract authorization for a specific token

#### Parameters

##### params

###### chainId

[`ChainId`](../type-aliases/ChainId.md)

###### tokenAddress

`` `0x${string}` ``

#### Returns

`Promise`\<\[[`Permit2RevokeTransactionInfo`](../type-aliases/Permit2RevokeTransactionInfo.md)\]\>

***

### isPermit2AuthorizationNeeded()

```ts
isPermit2AuthorizationNeeded(params): Promise<boolean>;
```

Defined in: [src/interfaces/IAllowanceManagerClient.ts:31](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/interfaces/IAllowanceManagerClient.ts#L31)

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

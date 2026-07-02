# Interface: IResolvedRoundsVault

Defined in: [../sdk-common/src/common/interfaces/IResolvedRoundsVault.ts:11](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IResolvedRoundsVault.ts#L11)

Metadata for one side (Input or Output) of a Fleet's RoundsVault pair, resolved from
the RWA subgraph. Used by the RWA manager to build deposit/withdraw transactions and
round reads against the correct RoundsVault contract.

## Properties

### address

```ts
address: `0x${string}`;
```

Defined in: [../sdk-common/src/common/interfaces/IResolvedRoundsVault.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IResolvedRoundsVault.ts#L15)

The RoundsVault contract address

***

### chainId

```ts
chainId: ChainId;
```

Defined in: [../sdk-common/src/common/interfaces/IResolvedRoundsVault.ts:13](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IResolvedRoundsVault.ts#L13)

The chain the RoundsVault is deployed on

***

### exchangeAssetToken

```ts
exchangeAssetToken: ITokenStanalone;
```

Defined in: [../sdk-common/src/common/interfaces/IResolvedRoundsVault.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IResolvedRoundsVault.ts#L19)

Token returned at settlement (Input: Fleet shares; Output: Fleet underlying e.g. USDC)

***

### minPositionSize

```ts
minPositionSize: ITokenAmount;
```

Defined in: [../sdk-common/src/common/interfaces/IResolvedRoundsVault.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IResolvedRoundsVault.ts#L21)

Minimum position size in underlying token for the RoundsVault

***

### underlyingToken

```ts
underlyingToken: ITokenStanalone;
```

Defined in: [../sdk-common/src/common/interfaces/IResolvedRoundsVault.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IResolvedRoundsVault.ts#L17)

Token deposited by users (Input: Fleet underlying e.g. USDC; Output: Fleet shares)

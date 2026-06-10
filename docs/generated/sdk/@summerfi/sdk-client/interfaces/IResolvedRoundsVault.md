# Interface: IResolvedRoundsVault

Defined in: [../sdk-common/src/common/interfaces/IResolvedRoundsVault.ts:12](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IResolvedRoundsVault.ts#L12)

IResolvedRoundsVault

## Description

Metadata for one side (Input or Output) of a Fleet's RoundsVault pair, resolved from
             the RWA subgraph. Used by the RWA manager to build deposit/withdraw transactions and
             round reads against the correct RoundsVault contract.

## Properties

### address

```ts
address: `0x${string}`;
```

Defined in: [../sdk-common/src/common/interfaces/IResolvedRoundsVault.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IResolvedRoundsVault.ts#L16)

The RoundsVault contract address

***

### chainId

```ts
chainId: ChainId;
```

Defined in: [../sdk-common/src/common/interfaces/IResolvedRoundsVault.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IResolvedRoundsVault.ts#L14)

The chain the RoundsVault is deployed on

***

### exchangeAssetToken

```ts
exchangeAssetToken: ITokenStanalone;
```

Defined in: [../sdk-common/src/common/interfaces/IResolvedRoundsVault.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IResolvedRoundsVault.ts#L20)

Token returned at settlement (Input: Fleet shares; Output: Fleet underlying e.g. USDC)

***

### minPositionSize

```ts
minPositionSize: ITokenAmount;
```

Defined in: [../sdk-common/src/common/interfaces/IResolvedRoundsVault.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IResolvedRoundsVault.ts#L22)

Minimum position size in underlying token for the RoundsVault

***

### underlyingToken

```ts
underlyingToken: ITokenStanalone;
```

Defined in: [../sdk-common/src/common/interfaces/IResolvedRoundsVault.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IResolvedRoundsVault.ts#L18)

Token deposited by users (Input: Fleet underlying e.g. USDC; Output: Fleet shares)

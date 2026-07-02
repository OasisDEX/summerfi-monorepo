# Interface: IDcaStrategyConfig

Defined in: [src/common/interfaces/IDcaStrategyConfig.ts:9](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategyConfig.ts#L9)

## Name

IDcaStrategyConfig

## Description

Serializable representation of the IDCAStrategyManager.StrategyConfig calldata struct.
             Numeric fields are raw uint256 values encoded as base-10 strings.

## Properties

### endDate

```ts
endDate: bigint;
```

Defined in: [src/common/interfaces/IDcaStrategyConfig.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategyConfig.ts#L24)

***

### inAsset

```ts
inAsset: `0x${string}`;
```

Defined in: [src/common/interfaces/IDcaStrategyConfig.ts:13](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategyConfig.ts#L13)

***

### inAssetFeed

```ts
inAssetFeed: IChainlinkFeed;
```

Defined in: [src/common/interfaces/IDcaStrategyConfig.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategyConfig.ts#L15)

***

### interval

```ts
interval: bigint;
```

Defined in: [src/common/interfaces/IDcaStrategyConfig.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategyConfig.ts#L18)

***

### maxPrice

```ts
maxPrice: bigint;
```

Defined in: [src/common/interfaces/IDcaStrategyConfig.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategyConfig.ts#L21)

Price ceiling in oracle units. Maps to the UI concept of never buy above.

***

### maxTrades

```ts
maxTrades: bigint;
```

Defined in: [src/common/interfaces/IDcaStrategyConfig.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategyConfig.ts#L25)

***

### minPrice

```ts
minPrice: bigint;
```

Defined in: [src/common/interfaces/IDcaStrategyConfig.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategyConfig.ts#L23)

Price floor in oracle units. Maps to the UI concept of never sell below.

***

### outAsset

```ts
outAsset: `0x${string}`;
```

Defined in: [src/common/interfaces/IDcaStrategyConfig.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategyConfig.ts#L14)

***

### outAssetFeed

```ts
outAssetFeed: IChainlinkFeed;
```

Defined in: [src/common/interfaces/IDcaStrategyConfig.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategyConfig.ts#L16)

***

### owner

```ts
owner: `0x${string}`;
```

Defined in: [src/common/interfaces/IDcaStrategyConfig.ts:10](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategyConfig.ts#L10)

***

### slippageBps

```ts
slippageBps: bigint;
```

Defined in: [src/common/interfaces/IDcaStrategyConfig.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategyConfig.ts#L19)

***

### sourceVault

```ts
sourceVault: `0x${string}`;
```

Defined in: [src/common/interfaces/IDcaStrategyConfig.ts:11](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategyConfig.ts#L11)

***

### targetVault

```ts
targetVault: `0x${string}`;
```

Defined in: [src/common/interfaces/IDcaStrategyConfig.ts:12](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategyConfig.ts#L12)

***

### tradeAmount

```ts
tradeAmount: bigint;
```

Defined in: [src/common/interfaces/IDcaStrategyConfig.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategyConfig.ts#L17)

# Interface: IDcaStrategyConfig

Defined in: [sdk/sdk-common/src/common/interfaces/IDcaStrategyConfig.ts:8](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/IDcaStrategyConfig.ts#L8)

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

Defined in: [sdk/sdk-common/src/common/interfaces/IDcaStrategyConfig.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/IDcaStrategyConfig.ts#L23)

***

### inAsset

```ts
inAsset: `0x${string}`;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IDcaStrategyConfig.ts:12](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/IDcaStrategyConfig.ts#L12)

***

### inAssetFeed

```ts
inAssetFeed: `0x${string}`;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IDcaStrategyConfig.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/IDcaStrategyConfig.ts#L14)

***

### interval

```ts
interval: bigint;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IDcaStrategyConfig.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/IDcaStrategyConfig.ts#L17)

***

### maxPrice

```ts
maxPrice: bigint;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IDcaStrategyConfig.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/IDcaStrategyConfig.ts#L20)

Price ceiling in oracle units. Maps to the UI concept of never buy above.

***

### maxTrades

```ts
maxTrades: bigint;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IDcaStrategyConfig.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/IDcaStrategyConfig.ts#L24)

***

### minPrice

```ts
minPrice: bigint;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IDcaStrategyConfig.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/IDcaStrategyConfig.ts#L22)

Price floor in oracle units. Maps to the UI concept of never sell below.

***

### outAsset

```ts
outAsset: `0x${string}`;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IDcaStrategyConfig.ts:13](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/IDcaStrategyConfig.ts#L13)

***

### outAssetFeed

```ts
outAssetFeed: `0x${string}`;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IDcaStrategyConfig.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/IDcaStrategyConfig.ts#L15)

***

### owner

```ts
owner: `0x${string}`;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IDcaStrategyConfig.ts:9](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/IDcaStrategyConfig.ts#L9)

***

### slippageBps

```ts
slippageBps: bigint;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IDcaStrategyConfig.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/IDcaStrategyConfig.ts#L18)

***

### sourceVault

```ts
sourceVault: `0x${string}`;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IDcaStrategyConfig.ts:10](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/IDcaStrategyConfig.ts#L10)

***

### targetVault

```ts
targetVault: `0x${string}`;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IDcaStrategyConfig.ts:11](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/IDcaStrategyConfig.ts#L11)

***

### tradeAmount

```ts
tradeAmount: bigint;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IDcaStrategyConfig.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/IDcaStrategyConfig.ts#L16)

# Interface: IDcaStrategy

Defined in: [src/common/interfaces/IDcaStrategy.ts:6](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L6)

A configured DCA (dollar-cost-averaging) strategy and its current on-chain execution state.

## Properties

### chainId

```ts
chainId: ChainId;
```

Defined in: [src/common/interfaces/IDcaStrategy.ts:12](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L12)

The chain on which the strategy is executed

***

### createdAtUnixTimestamp

```ts
createdAtUnixTimestamp: bigint;
```

Defined in: [src/common/interfaces/IDcaStrategy.ts:50](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L50)

Unix timestamp when the strategy was created

***

### deadlineUnixTimestamp

```ts
deadlineUnixTimestamp: bigint;
```

Defined in: [src/common/interfaces/IDcaStrategy.ts:38](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L38)

Unix timestamp after which the order stops executing

***

### id

```ts
id: string;
```

Defined in: [src/common/interfaces/IDcaStrategy.ts:8](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L8)

Unique identifier for the DCA strategy in graph

***

### inAsset

```ts
inAsset: `0x${string}`;
```

Defined in: [src/common/interfaces/IDcaStrategy.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L20)

The underlying asset of the source vault (input asset for DCA trades)

***

### inAssetFeed

```ts
inAssetFeed: `0x${string}`;
```

Defined in: [src/common/interfaces/IDcaStrategy.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L24)

Oracle price feed address for the input asset

***

### intervalSeconds

```ts
intervalSeconds: bigint;
```

Defined in: [src/common/interfaces/IDcaStrategy.ts:32](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L32)

Interval between consecutive trades, in seconds

***

### lastScheduledAtUnixTimestamp

```ts
lastScheduledAtUnixTimestamp: bigint;
```

Defined in: [src/common/interfaces/IDcaStrategy.ts:36](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L36)

Unix timestamp of the last scheduled execution

***

### maxTrades

```ts
maxTrades: bigint;
```

Defined in: [src/common/interfaces/IDcaStrategy.ts:42](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L42)

Maximum number of trades to execute before the order completes

***

### neverBuyAbove

```ts
neverBuyAbove: string;
```

Defined in: [src/common/interfaces/IDcaStrategy.ts:46](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L46)

Price ceiling — skip execution if the fromVault token price is above this value. Zero means no ceiling. Full token units

***

### neverSellBelow

```ts
neverSellBelow: string;
```

Defined in: [src/common/interfaces/IDcaStrategy.ts:48](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L48)

Price floor — skip execution if the toVault token price is below this value. Zero means no floor. Full token units

***

### nextTriggerAtUnixTimestamp

```ts
nextTriggerAtUnixTimestamp: bigint;
```

Defined in: [src/common/interfaces/IDcaStrategy.ts:34](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L34)

Unix timestamp of the next scheduled execution

***

### outAsset

```ts
outAsset: `0x${string}`;
```

Defined in: [src/common/interfaces/IDcaStrategy.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L22)

The underlying asset of the target vault (output asset for DCA trades)

***

### outAssetFeed

```ts
outAssetFeed: `0x${string}`;
```

Defined in: [src/common/interfaces/IDcaStrategy.ts:26](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L26)

Oracle price feed address for the output asset

***

### ownerAddress

```ts
ownerAddress: `0x${string}`;
```

Defined in: [src/common/interfaces/IDcaStrategy.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L14)

The EOA that owns the strategy

***

### slippagePercentage

```ts
slippagePercentage: number;
```

Defined in: [src/common/interfaces/IDcaStrategy.ts:30](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L30)

Maximum allowed slippage for each trade, expressed as a percentage

***

### sourceVault

```ts
sourceVault: `0x${string}`;
```

Defined in: [src/common/interfaces/IDcaStrategy.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L16)

The vault from which assets will be sold in DCA trades

***

### status

```ts
status: DcaStrategyStatusEnum;
```

Defined in: [src/common/interfaces/IDcaStrategy.ts:40](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L40)

Current status of the strategy

***

### strategyId

```ts
strategyId: bigint;
```

Defined in: [src/common/interfaces/IDcaStrategy.ts:10](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L10)

On-chain strategy ID

***

### targetVault

```ts
targetVault: `0x${string}`;
```

Defined in: [src/common/interfaces/IDcaStrategy.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L18)

The vault to which assets will be bought in DCA trades

***

### tradeAmount

```ts
tradeAmount: bigint;
```

Defined in: [src/common/interfaces/IDcaStrategy.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L28)

Amount to trade in each execution, denominated in the source vault's underlying asset decimals

***

### tradesExecuted

```ts
tradesExecuted: bigint;
```

Defined in: [src/common/interfaces/IDcaStrategy.ts:44](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L44)

Number of trades that have been executed so far

***

### updatedAtUnixTimestamp

```ts
updatedAtUnixTimestamp: bigint;
```

Defined in: [src/common/interfaces/IDcaStrategy.ts:52](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L52)

Unix timestamp when the strategy was last updated

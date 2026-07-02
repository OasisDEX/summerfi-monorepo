# Interface: IDcaStrategy

Defined in: [../sdk-common/src/common/interfaces/IDcaStrategy.ts:7](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L7)

A configured DCA (dollar-cost-averaging) strategy and its current on-chain execution state.

## Properties

### chainId

```ts
chainId: ChainId;
```

Defined in: [../sdk-common/src/common/interfaces/IDcaStrategy.ts:13](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L13)

The chain on which the strategy is executed

***

### createdAtUnixTimestamp

```ts
createdAtUnixTimestamp: bigint;
```

Defined in: [../sdk-common/src/common/interfaces/IDcaStrategy.ts:51](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L51)

Unix timestamp when the strategy was created

***

### deadlineUnixTimestamp

```ts
deadlineUnixTimestamp: bigint;
```

Defined in: [../sdk-common/src/common/interfaces/IDcaStrategy.ts:39](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L39)

Unix timestamp after which the order stops executing

***

### id

```ts
id: string;
```

Defined in: [../sdk-common/src/common/interfaces/IDcaStrategy.ts:9](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L9)

Unique identifier for the DCA strategy in graph

***

### inAsset

```ts
inAsset: `0x${string}`;
```

Defined in: [../sdk-common/src/common/interfaces/IDcaStrategy.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L21)

The underlying asset of the source vault (input asset for DCA trades)

***

### inAssetFeed

```ts
inAssetFeed: IChainlinkFeed;
```

Defined in: [../sdk-common/src/common/interfaces/IDcaStrategy.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L25)

Oracle price feed (address + max staleness) for the input asset

***

### intervalSeconds

```ts
intervalSeconds: bigint;
```

Defined in: [../sdk-common/src/common/interfaces/IDcaStrategy.ts:33](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L33)

Interval between consecutive trades, in seconds

***

### lastScheduledAtUnixTimestamp

```ts
lastScheduledAtUnixTimestamp: bigint;
```

Defined in: [../sdk-common/src/common/interfaces/IDcaStrategy.ts:37](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L37)

Unix timestamp of the last scheduled execution

***

### maxTrades

```ts
maxTrades: bigint;
```

Defined in: [../sdk-common/src/common/interfaces/IDcaStrategy.ts:43](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L43)

Maximum number of trades to execute before the order completes

***

### neverBuyAbove

```ts
neverBuyAbove: string;
```

Defined in: [../sdk-common/src/common/interfaces/IDcaStrategy.ts:47](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L47)

Price ceiling — skip execution if the fromVault token price is above this value. Zero means no ceiling. Full token units

***

### neverSellBelow

```ts
neverSellBelow: string;
```

Defined in: [../sdk-common/src/common/interfaces/IDcaStrategy.ts:49](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L49)

Price floor — skip execution if the toVault token price is below this value. Zero means no floor. Full token units

***

### nextTriggerAtUnixTimestamp

```ts
nextTriggerAtUnixTimestamp: bigint;
```

Defined in: [../sdk-common/src/common/interfaces/IDcaStrategy.ts:35](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L35)

Unix timestamp of the next scheduled execution

***

### outAsset

```ts
outAsset: `0x${string}`;
```

Defined in: [../sdk-common/src/common/interfaces/IDcaStrategy.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L23)

The underlying asset of the target vault (output asset for DCA trades)

***

### outAssetFeed

```ts
outAssetFeed: IChainlinkFeed;
```

Defined in: [../sdk-common/src/common/interfaces/IDcaStrategy.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L27)

Oracle price feed (address + max staleness) for the output asset

***

### ownerAddress

```ts
ownerAddress: `0x${string}`;
```

Defined in: [../sdk-common/src/common/interfaces/IDcaStrategy.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L15)

The EOA that owns the strategy

***

### slippagePercentage

```ts
slippagePercentage: number;
```

Defined in: [../sdk-common/src/common/interfaces/IDcaStrategy.ts:31](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L31)

Maximum allowed slippage for each trade, expressed as a percentage

***

### sourceVault

```ts
sourceVault: `0x${string}`;
```

Defined in: [../sdk-common/src/common/interfaces/IDcaStrategy.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L17)

The vault from which assets will be sold in DCA trades

***

### status

```ts
status: DcaStrategyStatusEnum;
```

Defined in: [../sdk-common/src/common/interfaces/IDcaStrategy.ts:41](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L41)

Current status of the strategy

***

### strategyId

```ts
strategyId: bigint;
```

Defined in: [../sdk-common/src/common/interfaces/IDcaStrategy.ts:11](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L11)

On-chain strategy ID

***

### targetVault

```ts
targetVault: `0x${string}`;
```

Defined in: [../sdk-common/src/common/interfaces/IDcaStrategy.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L19)

The vault to which assets will be bought in DCA trades

***

### tradeAmount

```ts
tradeAmount: bigint;
```

Defined in: [../sdk-common/src/common/interfaces/IDcaStrategy.ts:29](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L29)

Amount to trade in each execution, denominated in the source vault's underlying asset decimals

***

### tradesExecuted

```ts
tradesExecuted: bigint;
```

Defined in: [../sdk-common/src/common/interfaces/IDcaStrategy.ts:45](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L45)

Number of trades that have been executed so far

***

### updatedAtUnixTimestamp

```ts
updatedAtUnixTimestamp: bigint;
```

Defined in: [../sdk-common/src/common/interfaces/IDcaStrategy.ts:53](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L53)

Unix timestamp when the strategy was last updated

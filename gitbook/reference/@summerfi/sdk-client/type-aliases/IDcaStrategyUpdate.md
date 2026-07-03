# Type Alias: IDcaStrategyUpdate

```ts
type IDcaStrategyUpdate = Partial<Pick<IDcaStrategy, 
  | "sourceVault"
  | "targetVault"
  | "inAsset"
  | "outAsset"
  | "inAssetFeed"
  | "outAssetFeed"
  | "tradeAmount"
  | "slippagePercentage"
  | "intervalSeconds"
  | "deadlineUnixTimestamp"
  | "maxTrades"
  | "neverBuyAbove"
| "neverSellBelow">>;
```

Defined in: [../sdk-common/src/common/interfaces/IDcaStrategy.ts:63](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IDcaStrategy.ts#L63)

The subset of [IDcaStrategy](../interfaces/IDcaStrategy.md) fields that can be changed by an on-chain `editStrategy` call.

Excludes the owner (the contract reverts on owner change) and all read-only/derived fields
(`id`, `strategyId`, `chainId`, `status`, execution counters and timestamps). Used as the `update`
payload of `editStrategyTx`: the SDK merges it over the current strategy to build the new config.

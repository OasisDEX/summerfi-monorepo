# Interface: IChainlinkFeed

Defined in: [src/common/interfaces/IChainlinkFeed.ts:8](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IChainlinkFeed.ts#L8)

Serializable representation of the on-chain `ChainlinkFeed` struct
embedded in `IDCAStrategyManager.StrategyConfig`.
`maxStaleness` is in seconds; `0` means the contract default (24h).

## Properties

### feed

```ts
feed: `0x${string}`;
```

Defined in: [src/common/interfaces/IChainlinkFeed.ts:9](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IChainlinkFeed.ts#L9)

***

### maxStaleness

```ts
maxStaleness: bigint;
```

Defined in: [src/common/interfaces/IChainlinkFeed.ts:10](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IChainlinkFeed.ts#L10)

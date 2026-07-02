# Interface: IFleetConfig

Defined in: [src/common/types/IFleetConfig.ts:7](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/types/IFleetConfig.ts#L7)

Data structure for rebalancing assets, used by Keepers of a fleet

## Properties

### bufferArk

```ts
readonly bufferArk: IAddress;
```

Defined in: [src/common/types/IFleetConfig.ts:9](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/types/IFleetConfig.ts#L9)

The address of the buffer Ark associated with this Fleet

***

### depositCap

```ts
readonly depositCap: ITokenAmount;
```

Defined in: [src/common/types/IFleetConfig.ts:13](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/types/IFleetConfig.ts#L13)

The maximum total value of assets that can be deposited into the fleet

***

### maxRebalanceOperations

```ts
readonly maxRebalanceOperations: string;
```

Defined in: [src/common/types/IFleetConfig.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/types/IFleetConfig.ts#L15)

The maximum number of rebalance operations that can be performed in a single rebalance transaction

***

### minimumBufferBalance

```ts
readonly minimumBufferBalance: ITokenAmount;
```

Defined in: [src/common/types/IFleetConfig.ts:11](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/types/IFleetConfig.ts#L11)

The minimum balance that should be maintained in the buffer Ark

***

### stakingRewardsManager

```ts
readonly stakingRewardsManager: IAddress;
```

Defined in: [src/common/types/IFleetConfig.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/types/IFleetConfig.ts#L17)

The address of the staking rewards manager contract

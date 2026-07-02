# Interface: IRebalanceData

Defined in: [../sdk-common/src/common/types/IRebalanceData.ts:11](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/types/IRebalanceData.ts#L11)

Data structure for rebalancing assets, used by Keepers of a fleet

## Properties

### amount

```ts
readonly amount: ITokenAmount;
```

Defined in: [../sdk-common/src/common/types/IRebalanceData.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/types/IRebalanceData.ts#L18)

Amount of tokens to be moved

***

### boardData?

```ts
readonly optional boardData: `0x${string}`;
```

Defined in: [../sdk-common/src/common/types/IRebalanceData.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/types/IRebalanceData.ts#L20)

Board data

***

### disembarkData?

```ts
readonly optional disembarkData: `0x${string}`;
```

Defined in: [../sdk-common/src/common/types/IRebalanceData.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/types/IRebalanceData.ts#L22)

Disembark data

***

### fromArk

```ts
readonly fromArk: IAddress;
```

Defined in: [../sdk-common/src/common/types/IRebalanceData.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/types/IRebalanceData.ts#L14)

Ark where the tokens are taken from

***

### toArk

```ts
readonly toArk: IAddress;
```

Defined in: [../sdk-common/src/common/types/IRebalanceData.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/types/IRebalanceData.ts#L16)

Ark where the tokens are moved to

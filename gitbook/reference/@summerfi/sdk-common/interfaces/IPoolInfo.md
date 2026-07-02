# Interface: IPoolInfo

Defined in: [src/common/interfaces/IPoolInfo.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPoolInfo.ts#L15)

Represents the extended information of a pool. It should contain extra info that is common for any type of pool

It is meant to be specialized for each type of pool, like a lending pool, a staking pool, etc...

## Extends

- [`IPoolInfoData`](../type-aliases/IPoolInfoData.md)

## Extended by

- [`IArmadaVaultInfo`](IArmadaVaultInfo.md)
- [`IRwaVaultInfo`](IRwaVaultInfo.md)
- [`ILendingPoolInfo`](ILendingPoolInfo.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [src/common/interfaces/IPoolInfo.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPoolInfo.ts#L17)

Signature to differentiate from similar interfaces

***

### id

```ts
readonly id: IPoolId;
```

Defined in: [src/common/interfaces/IPoolInfo.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPoolInfo.ts#L21)

Unique identifier for the pool, to be specialized for each protocol

#### Overrides

```ts
IPoolInfoData.id
```

***

### type

```ts
readonly type: PoolType;
```

Defined in: [src/common/interfaces/IPoolInfo.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPoolInfo.ts#L19)

Type of the pool

#### Overrides

```ts
IPoolInfoData.type
```

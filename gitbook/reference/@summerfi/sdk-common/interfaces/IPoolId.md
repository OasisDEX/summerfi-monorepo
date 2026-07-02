# Interface: IPoolId

Defined in: [src/common/interfaces/IPoolId.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPoolId.ts#L16)

Represents a pool's ID. This will be specialized for each protocol

It is a way to retrieve a pool from the protocol and it should include all the necessary information
to uniquely identify a pool

## Extends

- [`IPoolIdData`](../type-aliases/IPoolIdData.md)

## Extended by

- [`IArmadaVaultId`](IArmadaVaultId.md)
- [`ILendingPoolId`](ILendingPoolId.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [src/common/interfaces/IPoolId.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPoolId.ts#L18)

Signature to differentiate from similar interfaces

***

### protocol

```ts
readonly protocol: IProtocol;
```

Defined in: [src/common/interfaces/IPoolId.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPoolId.ts#L22)

Protocol where the pool is

#### Overrides

```ts
IPoolIdData.protocol
```

***

### type

```ts
readonly type: PoolType;
```

Defined in: [src/common/interfaces/IPoolId.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPoolId.ts#L20)

Pool type

#### Overrides

```ts
IPoolIdData.type
```

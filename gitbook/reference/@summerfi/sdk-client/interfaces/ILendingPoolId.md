# Interface: ILendingPoolId

Defined in: [../sdk-common/src/lending-protocols/interfaces/ILendingPoolId.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPoolId.ts#L20)

Identifies a generic lending pool. This will be specialized for each protocol

This is meant to be used for single pair collateral/debt lending pools. For multi-collateral pools,
a different interface should be used

Note: Typescript forces the interface to re-declare any properties that have different BUT compatible types.
This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936

## Extends

- [`IPoolId`](IPoolId.md).[`ILendingPoolIdData`](../type-aliases/ILendingPoolIdData.md)

## Extended by

- [`IAaveV3LendingPoolId`](IAaveV3LendingPoolId.md)
- [`IMakerLendingPoolId`](IMakerLendingPoolId.md)
- [`IMorphoLendingPoolId`](IMorphoLendingPoolId.md)
- [`ISparkLendingPoolId`](ISparkLendingPoolId.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [../sdk-common/src/lending-protocols/interfaces/ILendingPoolId.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPoolId.ts#L22)

Signature to differentiate it from other interfaces

#### Inherited from

[`IPoolId`](IPoolId.md).[`[___signature__]`](IPoolId.md#___signature__)

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [../sdk-common/src/common/interfaces/IPoolId.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPoolId.ts#L18)

Signature to differentiate from similar interfaces

#### Inherited from

```ts
IPoolId.[___signature__]
```

***

### protocol

```ts
readonly protocol: IProtocol;
```

Defined in: [../sdk-common/src/lending-protocols/interfaces/ILendingPoolId.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPoolId.ts#L24)

Protocol where the pool is

#### Overrides

[`IPoolId`](IPoolId.md).[`protocol`](IPoolId.md#protocol)

***

### type

```ts
readonly type: Lending;
```

Defined in: [../sdk-common/src/lending-protocols/interfaces/ILendingPoolId.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPoolId.ts#L27)

Pool type

#### Overrides

[`IPoolId`](IPoolId.md).[`type`](IPoolId.md#type)

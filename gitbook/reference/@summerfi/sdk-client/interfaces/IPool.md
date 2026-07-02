# Interface: IPool

Defined in: [../sdk-common/src/common/interfaces/IPool.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPool.ts#L17)

Represents a generic protocol pool. Contains information about the pool's ID,
which is specific to each protocol, and the pool's type

It is meant to be specialized for each type of pool

## Extends

- [`IPrintable`](IPrintable.md).[`IPoolData`](../type-aliases/IPoolData.md)

## Extended by

- [`IArmadaVault`](IArmadaVault.md)
- [`ILendingPool`](ILendingPool.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [../sdk-common/src/common/interfaces/IPool.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPool.ts#L19)

Signature to differentiate from similar interfaces

***

### id

```ts
readonly id: IPoolId;
```

Defined in: [../sdk-common/src/common/interfaces/IPool.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPool.ts#L23)

Unique identifier for the pool, to be specialized for each protocol

#### Overrides

```ts
IPoolData.id
```

***

### type

```ts
readonly type: PoolType;
```

Defined in: [../sdk-common/src/common/interfaces/IPool.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPool.ts#L21)

Type of the pool

#### Overrides

```ts
IPoolData.type
```

## Methods

### toString()

```ts
toString(): string;
```

Defined in: [../sdk-common/src/common/interfaces/IPrintable.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPrintable.ts#L14)

Returns a string representation of the object

#### Returns

`string`

string

The string representation should have enough info to debug the object

#### Inherited from

[`IPrintable`](IPrintable.md).[`toString`](IPrintable.md#tostring)

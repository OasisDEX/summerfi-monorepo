# Interface: ILendingPool

Defined in: [../sdk-common/src/lending-protocols/interfaces/ILendingPool.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPool.ts#L21)

Represents a lending pool for a single pair collateral/debt

A lending pool is a pool where users can deposit collateral and borrow debt against that collateral.
Typically the user will pay interest on the debt, and the collateral will be locked until the debt is repaid.

This interface is an abstraction of a lending pool and the specialization for each protocol happens at the IPool
level through the PoolId

## Extends

- [`IPool`](IPool.md).[`ILendingPoolData`](../type-aliases/ILendingPoolData.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [../sdk-common/src/lending-protocols/interfaces/ILendingPool.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPool.ts#L23)

Signature to differentiate from similar interfaces

#### Inherited from

[`IPool`](IPool.md).[`[___signature__]`](IPool.md#___signature__)

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [../sdk-common/src/common/interfaces/IPool.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPool.ts#L19)

Signature to differentiate from similar interfaces

#### Inherited from

```ts
IPool.[___signature__]
```

***

### collateralToken

```ts
readonly collateralToken: ITokenStanalone;
```

Defined in: [../sdk-common/src/lending-protocols/interfaces/ILendingPool.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPool.ts#L27)

Collateral token used to collateralized the pool

#### Overrides

```ts
ILendingPoolData.collateralToken
```

***

### debtToken

```ts
readonly debtToken: ITokenStanalone;
```

Defined in: [../sdk-common/src/lending-protocols/interfaces/ILendingPool.ts:29](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPool.ts#L29)

Debt token, which can be borrowed from the pool

#### Overrides

```ts
ILendingPoolData.debtToken
```

***

### id

```ts
readonly id: ILendingPoolId;
```

Defined in: [../sdk-common/src/lending-protocols/interfaces/ILendingPool.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPool.ts#L25)

Pool ID of the lending pool

#### Overrides

[`IPool`](IPool.md).[`id`](IPool.md#id)

***

### type

```ts
readonly type: Lending;
```

Defined in: [../sdk-common/src/lending-protocols/interfaces/ILendingPool.ts:32](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPool.ts#L32)

Type of the pool

#### Overrides

[`IPool`](IPool.md).[`type`](IPool.md#type)

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

[`IPool`](IPool.md).[`toString`](IPool.md#tostring)

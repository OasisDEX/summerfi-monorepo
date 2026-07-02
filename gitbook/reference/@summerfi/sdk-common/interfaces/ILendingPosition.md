# Interface: ILendingPosition

Defined in: [src/lending-protocols/interfaces/ILendingPosition.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPosition.ts#L17)

Represents a position in a Lending protocol

## Extends

- [`IPosition`](IPosition.md).[`ILendingPositionData`](../type-aliases/ILendingPositionData.md)

## Extended by

- [`IExternalLendingPosition`](IExternalLendingPosition.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [src/lending-protocols/interfaces/ILendingPosition.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPosition.ts#L19)

Signature to differentiate from similar interfaces

#### Inherited from

[`IPosition`](IPosition.md).[`[___signature__]`](IPosition.md#___signature__)

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [src/common/interfaces/IPosition.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPosition.ts#L16)

Signature to differentiate from similar interfaces

#### Inherited from

```ts
IPosition.[___signature__]
```

***

### collateralAmount

```ts
readonly collateralAmount: ITokenAmount;
```

Defined in: [src/lending-protocols/interfaces/ILendingPosition.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPosition.ts#L27)

Amount of collateral deposited in the pool

#### Overrides

```ts
ILendingPositionData.collateralAmount
```

***

### debtAmount

```ts
readonly debtAmount: ITokenAmount;
```

Defined in: [src/lending-protocols/interfaces/ILendingPosition.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPosition.ts#L25)

Amount of debt borrowed from the pool

#### Overrides

```ts
ILendingPositionData.debtAmount
```

***

### id

```ts
readonly id: ILendingPositionId;
```

Defined in: [src/lending-protocols/interfaces/ILendingPosition.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPosition.ts#L23)

Unique identifier for the position inside the Summer.fi system

#### Overrides

[`IPosition`](IPosition.md).[`id`](IPosition.md#id)

***

### pool

```ts
readonly pool: ILendingPool;
```

Defined in: [src/lending-protocols/interfaces/ILendingPosition.ts:29](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPosition.ts#L29)

Pool where the position is

#### Overrides

[`IPosition`](IPosition.md).[`pool`](IPosition.md#pool)

***

### subtype

```ts
readonly subtype: LendingPositionType;
```

Defined in: [src/lending-protocols/interfaces/ILendingPosition.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPosition.ts#L21)

Subtype of the position in the Summer.fi system

#### Overrides

```ts
ILendingPositionData.subtype
```

***

### type

```ts
readonly type: Lending;
```

Defined in: [src/lending-protocols/interfaces/ILendingPosition.ts:32](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPosition.ts#L32)

Type of the position in the Summer.fi system

#### Overrides

[`IPosition`](IPosition.md).[`type`](IPosition.md#type)

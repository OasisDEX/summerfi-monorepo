# Interface: IExternalLendingPosition

Defined in: [src/orders/importing/interfaces/IExternalLendingPosition.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/importing/interfaces/IExternalLendingPosition.ts#L17)

Lending position existing in another service

## Extends

- [`ILendingPosition`](ILendingPosition.md).[`IPrintable`](IPrintable.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [src/orders/importing/interfaces/IExternalLendingPosition.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/importing/interfaces/IExternalLendingPosition.ts#L19)

Signature used to differentiate it from similar interfaces

#### Inherited from

[`ILendingPosition`](ILendingPosition.md).[`[___signature__]`](ILendingPosition.md#___signature__)

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [src/lending-protocols/interfaces/ILendingPosition.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPosition.ts#L19)

Signature to differentiate from similar interfaces

#### Inherited from

```ts
ILendingPosition.[___signature__]
```

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [src/common/interfaces/IPosition.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPosition.ts#L16)

Signature to differentiate from similar interfaces

#### Inherited from

```ts
ILendingPosition.[___signature__]
```

***

### collateralAmount

```ts
readonly collateralAmount: ITokenAmount;
```

Defined in: [src/lending-protocols/interfaces/ILendingPosition.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPosition.ts#L27)

Amount of collateral deposited in the pool

#### Inherited from

[`ILendingPosition`](ILendingPosition.md).[`collateralAmount`](ILendingPosition.md#collateralamount)

***

### debtAmount

```ts
readonly debtAmount: ITokenAmount;
```

Defined in: [src/lending-protocols/interfaces/ILendingPosition.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPosition.ts#L25)

Amount of debt borrowed from the pool

#### Inherited from

[`ILendingPosition`](ILendingPosition.md).[`debtAmount`](ILendingPosition.md#debtamount)

***

### id

```ts
readonly id: IExternalLendingPositionId;
```

Defined in: [src/orders/importing/interfaces/IExternalLendingPosition.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/importing/interfaces/IExternalLendingPosition.ts#L21)

External position ID

#### Overrides

[`ILendingPosition`](ILendingPosition.md).[`id`](ILendingPosition.md#id)

***

### pool

```ts
readonly pool: ILendingPool;
```

Defined in: [src/lending-protocols/interfaces/ILendingPosition.ts:29](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPosition.ts#L29)

Pool where the position is

#### Inherited from

[`ILendingPosition`](ILendingPosition.md).[`pool`](ILendingPosition.md#pool)

***

### subtype

```ts
readonly subtype: LendingPositionType;
```

Defined in: [src/lending-protocols/interfaces/ILendingPosition.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPosition.ts#L21)

Subtype of the position in the Summer.fi system

#### Inherited from

[`ILendingPosition`](ILendingPosition.md).[`subtype`](ILendingPosition.md#subtype)

***

### type

```ts
readonly type: Lending;
```

Defined in: [src/lending-protocols/interfaces/ILendingPosition.ts:32](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ILendingPosition.ts#L32)

Type of the position in the Summer.fi system

#### Inherited from

[`ILendingPosition`](ILendingPosition.md).[`type`](ILendingPosition.md#type)

## Methods

### toString()

```ts
toString(): string;
```

Defined in: [src/common/interfaces/IPrintable.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPrintable.ts#L14)

Returns a string representation of the object

#### Returns

`string`

string

The string representation should have enough info to debug the object

#### Inherited from

[`IPrintable`](IPrintable.md).[`toString`](IPrintable.md#tostring)

# Class: ExternalLendingPosition

Defined in: [../sdk-common/src/orders/importing/implementation/ExternalLendingPosition.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/importing/implementation/ExternalLendingPosition.ts#L19)

## See

IExternalLendingPosition

## Extends

- [`LendingPosition`](LendingPosition.md)

## Implements

- [`IExternalLendingPosition`](../interfaces/IExternalLendingPosition.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [../sdk-common/src/orders/importing/implementation/ExternalLendingPosition.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/importing/implementation/ExternalLendingPosition.ts#L21)

SIGNATURE

#### Implementation of

[`IExternalLendingPosition`](../interfaces/IExternalLendingPosition.md).[`[___signature__]`](../interfaces/IExternalLendingPosition.md#___signature__-2)

#### Inherited from

[`LendingPosition`](LendingPosition.md).[`[___signature__]`](LendingPosition.md#___signature__)

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [../sdk-common/src/lending-protocols/implementation/LendingPosition.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/implementation/LendingPosition.ts#L24)

SIGNATURE

#### Implementation of

```ts
IExternalLendingPosition.[___signature__]
```

#### Inherited from

```ts
LendingPosition.[___signature__]
```

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [../sdk-common/src/common/implementation/Position.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Position.ts#L17)

SIGNATURE

#### Implementation of

```ts
IExternalLendingPosition.[___signature__]
```

#### Inherited from

```ts
LendingPosition.[___signature__]
```

***

### collateralAmount

```ts
readonly collateralAmount: ITokenAmount;
```

Defined in: [../sdk-common/src/lending-protocols/implementation/LendingPosition.ts:30](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/implementation/LendingPosition.ts#L30)

Amount of collateral deposited in the pool

#### Implementation of

[`IExternalLendingPosition`](../interfaces/IExternalLendingPosition.md).[`collateralAmount`](../interfaces/IExternalLendingPosition.md#collateralamount)

#### Inherited from

[`LendingPosition`](LendingPosition.md).[`collateralAmount`](LendingPosition.md#collateralamount)

***

### debtAmount

```ts
readonly debtAmount: ITokenAmount;
```

Defined in: [../sdk-common/src/lending-protocols/implementation/LendingPosition.ts:29](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/implementation/LendingPosition.ts#L29)

Amount of debt borrowed from the pool

#### Implementation of

[`IExternalLendingPosition`](../interfaces/IExternalLendingPosition.md).[`debtAmount`](../interfaces/IExternalLendingPosition.md#debtamount)

#### Inherited from

[`LendingPosition`](LendingPosition.md).[`debtAmount`](LendingPosition.md#debtamount)

***

### id

```ts
readonly id: IExternalLendingPositionId;
```

Defined in: [../sdk-common/src/orders/importing/implementation/ExternalLendingPosition.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/importing/implementation/ExternalLendingPosition.ts#L24)

ATTRIBUTES

#### Implementation of

[`IExternalLendingPosition`](../interfaces/IExternalLendingPosition.md).[`id`](../interfaces/IExternalLendingPosition.md#id)

#### Overrides

[`LendingPosition`](LendingPosition.md).[`id`](LendingPosition.md#id)

***

### pool

```ts
readonly pool: ILendingPool;
```

Defined in: [../sdk-common/src/orders/importing/implementation/ExternalLendingPosition.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/importing/implementation/ExternalLendingPosition.ts#L25)

Pool where the position is

#### Implementation of

[`IExternalLendingPosition`](../interfaces/IExternalLendingPosition.md).[`pool`](../interfaces/IExternalLendingPosition.md#pool)

#### Overrides

[`LendingPosition`](LendingPosition.md).[`pool`](LendingPosition.md#pool)

***

### subtype

```ts
readonly subtype: LendingPositionType;
```

Defined in: [../sdk-common/src/lending-protocols/implementation/LendingPosition.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/implementation/LendingPosition.ts#L27)

ATTRIBUTES

#### Implementation of

[`IExternalLendingPosition`](../interfaces/IExternalLendingPosition.md).[`subtype`](../interfaces/IExternalLendingPosition.md#subtype)

#### Inherited from

[`LendingPosition`](LendingPosition.md).[`subtype`](LendingPosition.md#subtype)

***

### type

```ts
readonly type: Lending = PositionType.Lending;
```

Defined in: [../sdk-common/src/lending-protocols/implementation/LendingPosition.ts:32](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/implementation/LendingPosition.ts#L32)

ATTRIBUTES

#### Implementation of

[`IExternalLendingPosition`](../interfaces/IExternalLendingPosition.md).[`type`](../interfaces/IExternalLendingPosition.md#type)

#### Inherited from

[`LendingPosition`](LendingPosition.md).[`type`](LendingPosition.md#type)

## Methods

### toString()

```ts
toString(): string;
```

Defined in: [../sdk-common/src/orders/importing/implementation/ExternalLendingPosition.ts:43](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/importing/implementation/ExternalLendingPosition.ts#L43)

#### Returns

`string`

#### See

IPrintable.toString

#### Implementation of

[`IExternalLendingPosition`](../interfaces/IExternalLendingPosition.md).[`toString`](../interfaces/IExternalLendingPosition.md#tostring)

***

### createFrom()

```ts
static createFrom(params): ExternalLendingPosition;
```

Defined in: [../sdk-common/src/orders/importing/implementation/ExternalLendingPosition.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/importing/implementation/ExternalLendingPosition.ts#L28)

FACTORY

#### Parameters

##### params

[`ExternalLendingPositionParameters`](../type-aliases/ExternalLendingPositionParameters.md)

#### Returns

`ExternalLendingPosition`

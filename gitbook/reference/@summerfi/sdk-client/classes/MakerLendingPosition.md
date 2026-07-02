# Class: MakerLendingPosition

Defined in: [../protocol-plugins/src/plugins/maker/implementation/MakerLendingPosition.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/maker/implementation/MakerLendingPosition.ts#L18)

## See

IMakerLendingPosition

## Extends

- [`LendingPosition`](LendingPosition.md)

## Implements

- `IMakerLendingPosition`

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [../protocol-plugins/src/plugins/maker/implementation/MakerLendingPosition.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/maker/implementation/MakerLendingPosition.ts#L20)

SIGNATURE

#### Implementation of

```ts
IMakerLendingPosition.[___signature__]
```

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
IMakerLendingPosition.[___signature__]
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
IMakerLendingPosition.[___signature__]
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

```ts
IMakerLendingPosition.collateralAmount
```

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

```ts
IMakerLendingPosition.debtAmount
```

#### Inherited from

[`LendingPosition`](LendingPosition.md).[`debtAmount`](LendingPosition.md#debtamount)

***

### id

```ts
readonly id: IMakerLendingPositionId;
```

Defined in: [../protocol-plugins/src/plugins/maker/implementation/MakerLendingPosition.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/maker/implementation/MakerLendingPosition.ts#L23)

ATTRIBUTES

#### Implementation of

```ts
IMakerLendingPosition.id
```

#### Overrides

[`LendingPosition`](LendingPosition.md).[`id`](LendingPosition.md#id)

***

### pool

```ts
readonly pool: IMakerLendingPool;
```

Defined in: [../protocol-plugins/src/plugins/maker/implementation/MakerLendingPosition.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/maker/implementation/MakerLendingPosition.ts#L24)

Pool where the position is

#### Implementation of

```ts
IMakerLendingPosition.pool
```

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

```ts
IMakerLendingPosition.subtype
```

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

```ts
IMakerLendingPosition.type
```

#### Inherited from

[`LendingPosition`](LendingPosition.md).[`type`](LendingPosition.md#type)

## Methods

### createFrom()

```ts
static createFrom(params): MakerLendingPosition;
```

Defined in: [../protocol-plugins/src/plugins/maker/implementation/MakerLendingPosition.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/maker/implementation/MakerLendingPosition.ts#L27)

FACTORY

#### Parameters

##### params

[`MakerLendingPositionParameters`](../type-aliases/MakerLendingPositionParameters.md)

#### Returns

`MakerLendingPosition`

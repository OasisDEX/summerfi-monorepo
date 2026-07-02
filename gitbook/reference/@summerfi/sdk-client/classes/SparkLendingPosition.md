# Class: SparkLendingPosition

Defined in: [../protocol-plugins/src/plugins/spark/implementation/SparkLendingPosition.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/spark/implementation/SparkLendingPosition.ts#L18)

## See

ISparkLendingPosition

## Extends

- [`LendingPosition`](LendingPosition.md)

## Implements

- `ISparkLendingPosition`

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [../protocol-plugins/src/plugins/spark/implementation/SparkLendingPosition.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/spark/implementation/SparkLendingPosition.ts#L20)

SIGNATURE

#### Implementation of

```ts
ISparkLendingPosition.[___signature__]
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
ISparkLendingPosition.[___signature__]
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
ISparkLendingPosition.[___signature__]
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
ISparkLendingPosition.collateralAmount
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
ISparkLendingPosition.debtAmount
```

#### Inherited from

[`LendingPosition`](LendingPosition.md).[`debtAmount`](LendingPosition.md#debtamount)

***

### id

```ts
readonly id: ISparkLendingPositionId;
```

Defined in: [../protocol-plugins/src/plugins/spark/implementation/SparkLendingPosition.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/spark/implementation/SparkLendingPosition.ts#L23)

ATTRIBUTES

#### Implementation of

```ts
ISparkLendingPosition.id
```

#### Overrides

[`LendingPosition`](LendingPosition.md).[`id`](LendingPosition.md#id)

***

### pool

```ts
readonly pool: ISparkLendingPool;
```

Defined in: [../protocol-plugins/src/plugins/spark/implementation/SparkLendingPosition.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/spark/implementation/SparkLendingPosition.ts#L24)

Pool where the position is

#### Implementation of

```ts
ISparkLendingPosition.pool
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
ISparkLendingPosition.subtype
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
ISparkLendingPosition.type
```

#### Inherited from

[`LendingPosition`](LendingPosition.md).[`type`](LendingPosition.md#type)

## Methods

### createFrom()

```ts
static createFrom(params): SparkLendingPosition;
```

Defined in: [../protocol-plugins/src/plugins/spark/implementation/SparkLendingPosition.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/spark/implementation/SparkLendingPosition.ts#L27)

FACTORY

#### Parameters

##### params

`SparkLendingPositionParameters`

#### Returns

`SparkLendingPosition`

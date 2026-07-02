# Class: AaveV3LendingPosition

Defined in: [../protocol-plugins/src/plugins/aave-v3/implementation/AaveV3LendingPosition.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/aave-v3/implementation/AaveV3LendingPosition.ts#L18)

## See

IAaveV3LendingPosition

## Extends

- [`LendingPosition`](LendingPosition.md)

## Implements

- `IAaveV3LendingPosition`

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [../protocol-plugins/src/plugins/aave-v3/implementation/AaveV3LendingPosition.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/aave-v3/implementation/AaveV3LendingPosition.ts#L20)

SIGNATURE

#### Implementation of

```ts
IAaveV3LendingPosition.[___signature__]
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
IAaveV3LendingPosition.[___signature__]
```

#### Inherited from

[`LendingPosition`](LendingPosition.md).[`[___signature__]`](LendingPosition.md#___signature__)

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [../sdk-common/src/common/implementation/Position.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Position.ts#L17)

SIGNATURE

#### Implementation of

```ts
IAaveV3LendingPosition.[___signature__]
```

#### Inherited from

[`Position`](Position.md).[`[___signature__]`](Position.md#___signature__)

***

### collateralAmount

```ts
readonly collateralAmount: ITokenAmount;
```

Defined in: [../sdk-common/src/lending-protocols/implementation/LendingPosition.ts:30](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/implementation/LendingPosition.ts#L30)

Amount of collateral deposited in the pool

#### Implementation of

```ts
IAaveV3LendingPosition.collateralAmount
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
IAaveV3LendingPosition.debtAmount
```

#### Inherited from

[`LendingPosition`](LendingPosition.md).[`debtAmount`](LendingPosition.md#debtamount)

***

### id

```ts
readonly id: IAaveV3LendingPositionId;
```

Defined in: [../protocol-plugins/src/plugins/aave-v3/implementation/AaveV3LendingPosition.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/aave-v3/implementation/AaveV3LendingPosition.ts#L24)

Unique identifier for the position inside the Summer.fi system

#### Implementation of

```ts
IAaveV3LendingPosition.id
```

#### Overrides

[`LendingPosition`](LendingPosition.md).[`id`](LendingPosition.md#id)

***

### pool

```ts
readonly pool: IAaveV3LendingPool;
```

Defined in: [../protocol-plugins/src/plugins/aave-v3/implementation/AaveV3LendingPosition.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/aave-v3/implementation/AaveV3LendingPosition.ts#L23)

ATTRIBUTES

#### Implementation of

```ts
IAaveV3LendingPosition.pool
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
IAaveV3LendingPosition.subtype
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
IAaveV3LendingPosition.type
```

#### Inherited from

[`LendingPosition`](LendingPosition.md).[`type`](LendingPosition.md#type)

## Methods

### createFrom()

```ts
static createFrom(params): AaveV3LendingPosition;
```

Defined in: [../protocol-plugins/src/plugins/aave-v3/implementation/AaveV3LendingPosition.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/aave-v3/implementation/AaveV3LendingPosition.ts#L27)

FACTORY

#### Parameters

##### params

`AaveV3LendingPositionParameters`

#### Returns

`AaveV3LendingPosition`

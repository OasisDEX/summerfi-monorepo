# Class: SparkLendingPoolId

Defined in: [../protocol-plugins/src/plugins/spark/implementation/SparkLendingPoolId.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/spark/implementation/SparkLendingPoolId.ts#L18)

## See

ISparkLendingPoolIdData

## Extends

- [`LendingPoolId`](LendingPoolId.md)

## Implements

- [`ISparkLendingPoolId`](../interfaces/ISparkLendingPoolId.md)
- [`IPrintable`](../interfaces/IPrintable.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [../protocol-plugins/src/plugins/spark/implementation/SparkLendingPoolId.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/spark/implementation/SparkLendingPoolId.ts#L20)

SIGNATURE

#### Implementation of

[`ISparkLendingPoolId`](../interfaces/ISparkLendingPoolId.md).[`[___signature__]`](../interfaces/ISparkLendingPoolId.md#___signature__-2)

#### Inherited from

[`LendingPoolId`](LendingPoolId.md).[`[___signature__]`](LendingPoolId.md#___signature__)

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [../sdk-common/src/lending-protocols/implementation/LendingPoolId.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/implementation/LendingPoolId.ts#L18)

SIGNATURE

#### Implementation of

```ts
ISparkLendingPoolId.[___signature__]
```

#### Inherited from

```ts
LendingPoolId.[___signature__]
```

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [../sdk-common/src/common/implementation/PoolId.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/PoolId.ts#L17)

SIGNATURE

#### Implementation of

```ts
ISparkLendingPoolId.[___signature__]
```

#### Inherited from

```ts
LendingPoolId.[___signature__]
```

***

### collateralToken

```ts
readonly collateralToken: ITokenStanalone;
```

Defined in: [../protocol-plugins/src/plugins/spark/implementation/SparkLendingPoolId.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/spark/implementation/SparkLendingPoolId.ts#L25)

The token used to collateralize the position

#### Implementation of

[`ISparkLendingPoolId`](../interfaces/ISparkLendingPoolId.md).[`collateralToken`](../interfaces/ISparkLendingPoolId.md#collateraltoken)

***

### debtToken

```ts
readonly debtToken: ITokenStanalone;
```

Defined in: [../protocol-plugins/src/plugins/spark/implementation/SparkLendingPoolId.ts:26](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/spark/implementation/SparkLendingPoolId.ts#L26)

The token used to borrow funds

#### Implementation of

[`ISparkLendingPoolId`](../interfaces/ISparkLendingPoolId.md).[`debtToken`](../interfaces/ISparkLendingPoolId.md#debttoken)

***

### emodeType

```ts
readonly emodeType: EmodeType;
```

Defined in: [../protocol-plugins/src/plugins/spark/implementation/SparkLendingPoolId.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/spark/implementation/SparkLendingPoolId.ts#L24)

The efficiency mode of the pool

#### Implementation of

[`ISparkLendingPoolId`](../interfaces/ISparkLendingPoolId.md).[`emodeType`](../interfaces/ISparkLendingPoolId.md#emodetype)

***

### protocol

```ts
readonly protocol: ISparkProtocol;
```

Defined in: [../protocol-plugins/src/plugins/spark/implementation/SparkLendingPoolId.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/spark/implementation/SparkLendingPoolId.ts#L23)

ATTRIBUTES

#### Implementation of

[`ISparkLendingPoolId`](../interfaces/ISparkLendingPoolId.md).[`protocol`](../interfaces/ISparkLendingPoolId.md#protocol)

#### Overrides

[`LendingPoolId`](LendingPoolId.md).[`protocol`](LendingPoolId.md#protocol)

***

### type

```ts
readonly type: Lending = PoolType.Lending;
```

Defined in: [../sdk-common/src/lending-protocols/implementation/LendingPoolId.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/implementation/LendingPoolId.ts#L21)

ATTRIBUTES

#### Implementation of

[`ISparkLendingPoolId`](../interfaces/ISparkLendingPoolId.md).[`type`](../interfaces/ISparkLendingPoolId.md#type)

#### Inherited from

[`LendingPoolId`](LendingPoolId.md).[`type`](LendingPoolId.md#type)

## Methods

### toString()

```ts
toString(): string;
```

Defined in: [../protocol-plugins/src/plugins/spark/implementation/SparkLendingPoolId.ts:43](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/spark/implementation/SparkLendingPoolId.ts#L43)

#### Returns

`string`

#### See

IPrintable.toString

#### Implementation of

[`IPrintable`](../interfaces/IPrintable.md).[`toString`](../interfaces/IPrintable.md#tostring)

#### Overrides

[`LendingPoolId`](LendingPoolId.md).[`toString`](LendingPoolId.md#tostring)

***

### createFrom()

```ts
static createFrom(params): SparkLendingPoolId;
```

Defined in: [../protocol-plugins/src/plugins/spark/implementation/SparkLendingPoolId.ts:29](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/spark/implementation/SparkLendingPoolId.ts#L29)

FACTORY

#### Parameters

##### params

`SparkLendingPoolIdParameters`

#### Returns

`SparkLendingPoolId`

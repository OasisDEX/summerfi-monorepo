# Class: SparkProtocol

Defined in: [../protocol-plugins/src/plugins/spark/implementation/SparkProtocol.ts:12](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/spark/implementation/SparkProtocol.ts#L12)

## See

ISparkProtocol

## Extends

- [`Protocol`](Protocol.md)

## Implements

- [`ISparkProtocol`](../interfaces/ISparkProtocol.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [../protocol-plugins/src/plugins/spark/implementation/SparkProtocol.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/spark/implementation/SparkProtocol.ts#L14)

SIGNATURE

#### Implementation of

[`ISparkProtocol`](../interfaces/ISparkProtocol.md).[`[___signature__]`](../interfaces/ISparkProtocol.md#___signature__-1)

#### Inherited from

[`Protocol`](Protocol.md).[`[___signature__]`](Protocol.md#___signature__)

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [../sdk-common/src/common/implementation/Protocol.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Protocol.ts#L17)

SIGNATURE

#### Implementation of

```ts
ISparkProtocol.[___signature__]
```

#### Inherited from

```ts
Protocol.[___signature__]
```

***

### chainInfo

```ts
readonly chainInfo: IChainInfo;
```

Defined in: [../sdk-common/src/common/implementation/Protocol.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Protocol.ts#L21)

The chain information

#### Implementation of

[`ISparkProtocol`](../interfaces/ISparkProtocol.md).[`chainInfo`](../interfaces/ISparkProtocol.md#chaininfo)

#### Inherited from

[`Protocol`](Protocol.md).[`chainInfo`](Protocol.md#chaininfo)

***

### name

```ts
readonly name: Spark = ProtocolName.Spark;
```

Defined in: [../protocol-plugins/src/plugins/spark/implementation/SparkProtocol.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/spark/implementation/SparkProtocol.ts#L17)

ATTRIBUTES

#### Implementation of

[`ISparkProtocol`](../interfaces/ISparkProtocol.md).[`name`](../interfaces/ISparkProtocol.md#name)

#### Overrides

[`Protocol`](Protocol.md).[`name`](Protocol.md#name)

## Methods

### equals()

```ts
equals(protocol): boolean;
```

Defined in: [../sdk-common/src/common/implementation/Protocol.ts:31](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Protocol.ts#L31)

#### Parameters

##### protocol

[`Protocol`](Protocol.md)

#### Returns

`boolean`

#### See

IProtocol.equals

#### Implementation of

[`ISparkProtocol`](../interfaces/ISparkProtocol.md).[`equals`](../interfaces/ISparkProtocol.md#equals)

#### Inherited from

[`Protocol`](Protocol.md).[`equals`](Protocol.md#equals)

***

### toString()

```ts
toString(): string;
```

Defined in: [../sdk-common/src/common/implementation/Protocol.ts:36](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Protocol.ts#L36)

#### Returns

`string`

#### See

IPrintable.toString

#### Inherited from

[`Protocol`](Protocol.md).[`toString`](Protocol.md#tostring)

***

### createFrom()

```ts
static createFrom(params): SparkProtocol;
```

Defined in: [../protocol-plugins/src/plugins/spark/implementation/SparkProtocol.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/spark/implementation/SparkProtocol.ts#L20)

FACTORY

#### Parameters

##### params

`SparkProtocolParameters`

#### Returns

`SparkProtocol`

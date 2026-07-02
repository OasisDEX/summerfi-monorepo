# Interface: ISparkProtocol

Defined in: [../protocol-plugins/src/plugins/spark/interfaces/ISparkProtocol.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/spark/interfaces/ISparkProtocol.ts#L17)

Identifier of the Spark protocol

This interface is used to add all the methods that the interface supports

Typescript forces the interface to re-declare any properties that have different BUT compatible types.
This may be fixed eventually, there is a discussion on the topic here: https://github.com/microsoft/TypeScript/issues/16936

## Extends

- `ISparkProtocolData`.[`IProtocol`](IProtocol.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [../protocol-plugins/src/plugins/spark/interfaces/ISparkProtocol.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/spark/interfaces/ISparkProtocol.ts#L19)

Interface signature used to differentiate it from similar interfaces

#### Inherited from

[`IProtocol`](IProtocol.md).[`[___signature__]`](IProtocol.md#___signature__)

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [../sdk-common/src/common/interfaces/IProtocol.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IProtocol.ts#L17)

Signature used to differentiate it from similar interfaces

#### Inherited from

```ts
IProtocol.[___signature__]
```

***

### chainInfo

```ts
readonly chainInfo: IChainInfo;
```

Defined in: [../sdk-common/src/common/interfaces/IProtocol.ts:38](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IProtocol.ts#L38)

The chain information

#### Inherited from

[`IProtocol`](IProtocol.md).[`chainInfo`](IProtocol.md#chaininfo)

***

### name

```ts
readonly name: Spark;
```

Defined in: [../protocol-plugins/src/plugins/spark/interfaces/ISparkProtocol.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/spark/interfaces/ISparkProtocol.ts#L22)

The name of the protocol

#### Overrides

[`IProtocol`](IProtocol.md).[`name`](IProtocol.md#name)

## Methods

### equals()

```ts
equals(protocol): boolean;
```

Defined in: [../sdk-common/src/common/interfaces/IProtocol.ts:30](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IProtocol.ts#L30)

Compare if the passed protocol is equal to the current protocol

#### Parameters

##### protocol

[`IProtocol`](IProtocol.md)

The protocol to compare

#### Returns

`boolean`

true if the protocols are equal

Equality is determined by the name and chain information

#### Inherited from

[`IProtocol`](IProtocol.md).[`equals`](IProtocol.md#equals)

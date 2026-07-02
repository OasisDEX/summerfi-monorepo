# Abstract Class: Protocol

Defined in: [../sdk-common/src/common/implementation/Protocol.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Protocol.ts#L15)

## See

IProtocol

## Extended by

- [`AaveV3Protocol`](AaveV3Protocol.md)
- [`MakerProtocol`](MakerProtocol.md)
- [`MorphoProtocol`](MorphoProtocol.md)
- [`SparkProtocol`](SparkProtocol.md)
- [`ArmadaProtocol`](ArmadaProtocol.md)

## Implements

- [`IProtocol`](../interfaces/IProtocol.md)
- [`IPrintable`](../interfaces/IPrintable.md)

## Constructors

### Constructor

```ts
protected new Protocol(params): Protocol;
```

Defined in: [../sdk-common/src/common/implementation/Protocol.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Protocol.ts#L24)

SEALED CONSTRUCTOR

#### Parameters

##### params

[`ProtocolParameters`](../type-aliases/ProtocolParameters.md)

#### Returns

`Protocol`

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [../sdk-common/src/common/implementation/Protocol.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Protocol.ts#L17)

SIGNATURE

#### Implementation of

[`IProtocol`](../interfaces/IProtocol.md).[`[___signature__]`](../interfaces/IProtocol.md#___signature__)

***

### chainInfo

```ts
readonly chainInfo: IChainInfo;
```

Defined in: [../sdk-common/src/common/implementation/Protocol.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Protocol.ts#L21)

The chain information

#### Implementation of

[`IProtocol`](../interfaces/IProtocol.md).[`chainInfo`](../interfaces/IProtocol.md#chaininfo)

***

### name

```ts
abstract readonly name: ProtocolName;
```

Defined in: [../sdk-common/src/common/implementation/Protocol.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Protocol.ts#L20)

ATTRIBUTES

#### Implementation of

[`IProtocol`](../interfaces/IProtocol.md).[`name`](../interfaces/IProtocol.md#name)

## Methods

### equals()

```ts
equals(protocol): boolean;
```

Defined in: [../sdk-common/src/common/implementation/Protocol.ts:31](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Protocol.ts#L31)

#### Parameters

##### protocol

`Protocol`

#### Returns

`boolean`

#### See

IProtocol.equals

#### Implementation of

[`IProtocol`](../interfaces/IProtocol.md).[`equals`](../interfaces/IProtocol.md#equals)

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

#### Implementation of

[`IPrintable`](../interfaces/IPrintable.md).[`toString`](../interfaces/IPrintable.md#tostring)

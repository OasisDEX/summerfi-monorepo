# Class: MakerProtocol

Defined in: [../protocol-plugins/src/plugins/maker/implementation/MakerProtocol.ts:12](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/maker/implementation/MakerProtocol.ts#L12)

## See

IMakerProtocolData

## Extends

- [`Protocol`](Protocol.md)

## Implements

- [`IMakerProtocol`](../interfaces/IMakerProtocol.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [../protocol-plugins/src/plugins/maker/implementation/MakerProtocol.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/maker/implementation/MakerProtocol.ts#L14)

SIGNATURE

#### Implementation of

[`IMakerProtocol`](../interfaces/IMakerProtocol.md).[`[___signature__]`](../interfaces/IMakerProtocol.md#___signature__-1)

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
IMakerProtocol.[___signature__]
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

[`IMakerProtocol`](../interfaces/IMakerProtocol.md).[`chainInfo`](../interfaces/IMakerProtocol.md#chaininfo)

#### Inherited from

[`Protocol`](Protocol.md).[`chainInfo`](Protocol.md#chaininfo)

***

### name

```ts
readonly name: Maker = ProtocolName.Maker;
```

Defined in: [../protocol-plugins/src/plugins/maker/implementation/MakerProtocol.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/maker/implementation/MakerProtocol.ts#L17)

ATTRIBUTES

#### Implementation of

[`IMakerProtocol`](../interfaces/IMakerProtocol.md).[`name`](../interfaces/IMakerProtocol.md#name)

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

[`IMakerProtocol`](../interfaces/IMakerProtocol.md).[`equals`](../interfaces/IMakerProtocol.md#equals)

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
static createFrom(params): MakerProtocol;
```

Defined in: [../protocol-plugins/src/plugins/maker/implementation/MakerProtocol.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/maker/implementation/MakerProtocol.ts#L20)

FACTORY

#### Parameters

##### params

`MakerProtocolParameters`

#### Returns

`MakerProtocol`

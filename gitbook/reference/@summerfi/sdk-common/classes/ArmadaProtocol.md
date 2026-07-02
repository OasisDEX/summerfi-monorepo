# Class: ArmadaProtocol

Defined in: [src/common/implementation/ArmadaProtocol.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaProtocol.ts#L15)

## See

IArmadaProtocol

## Extends

- [`Protocol`](Protocol.md)

## Implements

- [`IArmadaProtocol`](../interfaces/IArmadaProtocol.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [src/common/implementation/ArmadaProtocol.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaProtocol.ts#L17)

SIGNATURE

#### Implementation of

[`IArmadaProtocol`](../interfaces/IArmadaProtocol.md).[`[___signature__]`](../interfaces/IArmadaProtocol.md#___signature__-1)

#### Inherited from

[`Protocol`](Protocol.md).[`[___signature__]`](Protocol.md#___signature__)

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [src/common/implementation/Protocol.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Protocol.ts#L17)

SIGNATURE

#### Implementation of

```ts
IArmadaProtocol.[___signature__]
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

Defined in: [src/common/implementation/Protocol.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Protocol.ts#L21)

The chain information

#### Implementation of

[`IArmadaProtocol`](../interfaces/IArmadaProtocol.md).[`chainInfo`](../interfaces/IArmadaProtocol.md#chaininfo)

#### Inherited from

[`Protocol`](Protocol.md).[`chainInfo`](Protocol.md#chaininfo)

***

### name

```ts
readonly name: Armada = ProtocolName.Armada;
```

Defined in: [src/common/implementation/ArmadaProtocol.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaProtocol.ts#L20)

ATTRIBUTES

#### Implementation of

[`IArmadaProtocol`](../interfaces/IArmadaProtocol.md).[`name`](../interfaces/IArmadaProtocol.md#name)

#### Overrides

[`Protocol`](Protocol.md).[`name`](Protocol.md#name)

## Methods

### equals()

```ts
equals(protocol): boolean;
```

Defined in: [src/common/implementation/Protocol.ts:31](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Protocol.ts#L31)

#### Parameters

##### protocol

[`Protocol`](Protocol.md)

#### Returns

`boolean`

#### See

IProtocol.equals

#### Implementation of

[`IArmadaProtocol`](../interfaces/IArmadaProtocol.md).[`equals`](../interfaces/IArmadaProtocol.md#equals)

#### Inherited from

[`Protocol`](Protocol.md).[`equals`](Protocol.md#equals)

***

### toString()

```ts
toString(): string;
```

Defined in: [src/common/implementation/Protocol.ts:36](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Protocol.ts#L36)

#### Returns

`string`

#### See

IPrintable.toString

#### Inherited from

[`Protocol`](Protocol.md).[`toString`](Protocol.md#tostring)

***

### createFrom()

```ts
static createFrom(params): ArmadaProtocol;
```

Defined in: [src/common/implementation/ArmadaProtocol.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ArmadaProtocol.ts#L23)

FACTORY

#### Parameters

##### params

[`ArmadaProtocolParameters`](../type-aliases/ArmadaProtocolParameters.md)

#### Returns

`ArmadaProtocol`

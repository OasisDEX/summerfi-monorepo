# Interface: IArmadaProtocol

Defined in: [src/common/interfaces/IArmadaProtocol.ts:13](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaProtocol.ts#L13)

Interface for the Armada Protocol

## Extends

- [`IProtocol`](IProtocol.md).[`IArmadaProtocolData`](../type-aliases/IArmadaProtocolData.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [src/common/interfaces/IArmadaProtocol.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaProtocol.ts#L15)

Signature used to differentiate it from similar interfaces

#### Inherited from

[`IProtocol`](IProtocol.md).[`[___signature__]`](IProtocol.md#___signature__)

***

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [src/common/interfaces/IProtocol.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IProtocol.ts#L17)

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

Defined in: [src/common/interfaces/IProtocol.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IProtocol.ts#L21)

The chain information

#### Inherited from

[`IProtocol`](IProtocol.md).[`chainInfo`](IProtocol.md#chaininfo)

***

### name

```ts
readonly name: Armada;
```

Defined in: [src/common/interfaces/IArmadaProtocol.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IArmadaProtocol.ts#L18)

The name of the protocol

#### Overrides

[`IProtocol`](IProtocol.md).[`name`](IProtocol.md#name)

## Methods

### equals()

```ts
equals(protocol): boolean;
```

Defined in: [src/common/interfaces/IProtocol.ts:30](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IProtocol.ts#L30)

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

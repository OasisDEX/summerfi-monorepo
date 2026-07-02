# Interface: IProtocol

Defined in: [../sdk-common/src/common/interfaces/IProtocol.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IProtocol.ts#L15)

Information relative to a protocol

This interface is used to add all the methods that the interface supports

## Extends

- [`IProtocolData`](../type-aliases/IProtocolData.md)

## Extended by

- [`IAaveV3Protocol`](IAaveV3Protocol.md)
- [`IMakerProtocol`](IMakerProtocol.md)
- [`IMorphoProtocol`](IMorphoProtocol.md)
- [`ISparkProtocol`](ISparkProtocol.md)
- [`IArmadaProtocol`](IArmadaProtocol.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [../sdk-common/src/common/interfaces/IProtocol.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IProtocol.ts#L17)

Signature used to differentiate it from similar interfaces

***

### chainInfo

```ts
readonly chainInfo: IChainInfo;
```

Defined in: [../sdk-common/src/common/interfaces/IProtocol.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IProtocol.ts#L21)

The chain information

#### Overrides

```ts
IProtocolData.chainInfo
```

***

### name

```ts
readonly name: ProtocolName;
```

Defined in: [../sdk-common/src/common/interfaces/IProtocol.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IProtocol.ts#L19)

The name of the protocol

#### Overrides

```ts
IProtocolData.name
```

## Methods

### equals()

```ts
equals(protocol): boolean;
```

Defined in: [../sdk-common/src/common/interfaces/IProtocol.ts:30](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IProtocol.ts#L30)

Compare if the passed protocol is equal to the current protocol

#### Parameters

##### protocol

`IProtocol`

The protocol to compare

#### Returns

`boolean`

true if the protocols are equal

Equality is determined by the name and chain information

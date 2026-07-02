# Class: AaveV3Protocol

Defined in: [../protocol-plugins/src/plugins/aave-v3/implementation/AaveV3Protocol.ts:12](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/aave-v3/implementation/AaveV3Protocol.ts#L12)

## See

IAaveV3ProtocolData

## Extends

- [`Protocol`](Protocol.md)

## Implements

- [`IAaveV3Protocol`](../interfaces/IAaveV3Protocol.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [../protocol-plugins/src/plugins/aave-v3/implementation/AaveV3Protocol.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/aave-v3/implementation/AaveV3Protocol.ts#L14)

SIGNATURE

#### Implementation of

[`IAaveV3Protocol`](../interfaces/IAaveV3Protocol.md).[`[___signature__]`](../interfaces/IAaveV3Protocol.md#___signature__-1)

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
IAaveV3Protocol.[___signature__]
```

#### Inherited from

[`Protocol`](Protocol.md).[`[___signature__]`](Protocol.md#___signature__)

***

### chainInfo

```ts
readonly chainInfo: IChainInfo;
```

Defined in: [../sdk-common/src/common/implementation/Protocol.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/Protocol.ts#L21)

The chain information

#### Implementation of

[`IAaveV3Protocol`](../interfaces/IAaveV3Protocol.md).[`chainInfo`](../interfaces/IAaveV3Protocol.md#chaininfo)

#### Inherited from

[`Protocol`](Protocol.md).[`chainInfo`](Protocol.md#chaininfo)

***

### name

```ts
readonly name: AaveV3 = ProtocolName.AaveV3;
```

Defined in: [../protocol-plugins/src/plugins/aave-v3/implementation/AaveV3Protocol.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/aave-v3/implementation/AaveV3Protocol.ts#L17)

ATTRIBUTES

#### Implementation of

[`IAaveV3Protocol`](../interfaces/IAaveV3Protocol.md).[`name`](../interfaces/IAaveV3Protocol.md#name)

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

[`IAaveV3Protocol`](../interfaces/IAaveV3Protocol.md).[`equals`](../interfaces/IAaveV3Protocol.md#equals)

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
static createFrom(params): AaveV3Protocol;
```

Defined in: [../protocol-plugins/src/plugins/aave-v3/implementation/AaveV3Protocol.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/ugins/src/plugins/aave-v3/implementation/AaveV3Protocol.ts#L20)

FACTORY

#### Parameters

##### params

`AaveV3ProtocolParameters`

#### Returns

`AaveV3Protocol`

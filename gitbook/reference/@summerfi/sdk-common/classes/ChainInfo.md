# Class: ChainInfo

Defined in: [src/common/implementation/ChainInfo.ts:13](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ChainInfo.ts#L13)

## See

IChainInfo

## Implements

- [`IChainInfo`](../interfaces/IChainInfo.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [src/common/implementation/ChainInfo.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ChainInfo.ts#L15)

SIGNATURE

#### Implementation of

[`IChainInfo`](../interfaces/IChainInfo.md).[`[___signature__]`](../interfaces/IChainInfo.md#___signature__)

***

### chainId

```ts
readonly chainId: ChainId;
```

Defined in: [src/common/implementation/ChainInfo.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ChainInfo.ts#L18)

ATTRIBUTES

#### Implementation of

[`IChainInfo`](../interfaces/IChainInfo.md).[`chainId`](../interfaces/IChainInfo.md#chainid)

***

### name

```ts
readonly name: string;
```

Defined in: [src/common/implementation/ChainInfo.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ChainInfo.ts#L19)

The name of the network

#### Implementation of

[`IChainInfo`](../interfaces/IChainInfo.md).[`name`](../interfaces/IChainInfo.md#name)

## Methods

### equals()

```ts
equals(chainInfo): boolean;
```

Defined in: [src/common/implementation/ChainInfo.ts:38](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ChainInfo.ts#L38)

Determines whether this chain refers to the same network as another.

#### Parameters

##### chainInfo

`ChainInfo`

The other chain to compare against.

#### Returns

`boolean`

`true` if both have the same chain id.

#### Implementation of

[`IChainInfo`](../interfaces/IChainInfo.md).[`equals`](../interfaces/IChainInfo.md#equals)

***

### toString()

```ts
toString(): string;
```

Defined in: [src/common/implementation/ChainInfo.ts:47](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ChainInfo.ts#L47)

Returns a human-readable representation of the chain (its name and id).

#### Returns

`string`

A string in the form `"<name> (ID: <chainId>)"`.

#### Implementation of

[`IChainInfo`](../interfaces/IChainInfo.md).[`toString`](../interfaces/IChainInfo.md#tostring)

***

### createFrom()

```ts
static createFrom(params): ChainInfo;
```

Defined in: [src/common/implementation/ChainInfo.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/implementation/ChainInfo.ts#L22)

FACTORY METHODS

#### Parameters

##### params

[`ChainInfoParameters`](../type-aliases/ChainInfoParameters.md)

#### Returns

`ChainInfo`

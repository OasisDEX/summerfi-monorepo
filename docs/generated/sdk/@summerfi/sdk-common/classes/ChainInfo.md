# Class: ChainInfo

Defined in: [sdk/sdk-common/src/common/implementation/ChainInfo.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/ChainInfo.ts#L14)

## Name

ChainInfo

## See

IChainInfo

## Implements

- [`IChainInfo`](../interfaces/IChainInfo.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [sdk/sdk-common/src/common/implementation/ChainInfo.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/ChainInfo.ts#L16)

SIGNATURE

#### Implementation of

[`IChainInfo`](../interfaces/IChainInfo.md).[`[___signature__]`](../interfaces/IChainInfo.md#___signature__)

***

### chainId

```ts
readonly chainId: ChainId;
```

Defined in: [sdk/sdk-common/src/common/implementation/ChainInfo.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/ChainInfo.ts#L19)

ATTRIBUTES

#### Implementation of

[`IChainInfo`](../interfaces/IChainInfo.md).[`chainId`](../interfaces/IChainInfo.md#chainid)

***

### name

```ts
readonly name: string;
```

Defined in: [sdk/sdk-common/src/common/implementation/ChainInfo.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/ChainInfo.ts#L20)

The name of the network

#### Implementation of

[`IChainInfo`](../interfaces/IChainInfo.md).[`name`](../interfaces/IChainInfo.md#name)

## Methods

### equals()

```ts
equals(chainInfo): boolean;
```

Defined in: [sdk/sdk-common/src/common/implementation/ChainInfo.ts:39](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/ChainInfo.ts#L39)

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

Defined in: [sdk/sdk-common/src/common/implementation/ChainInfo.ts:48](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/ChainInfo.ts#L48)

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

Defined in: [sdk/sdk-common/src/common/implementation/ChainInfo.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/ChainInfo.ts#L23)

FACTORY METHODS

#### Parameters

##### params

[`ChainInfoParameters`](../type-aliases/ChainInfoParameters.md)

#### Returns

`ChainInfo`

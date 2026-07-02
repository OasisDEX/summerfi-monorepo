# Interface: IChainInfo

Defined in: [src/common/interfaces/IChainInfo.ts:13](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IChainInfo.ts#L13)

Information used to identify a blockchain network

## Extends

- [`IChainInfoData`](../type-aliases/IChainInfoData.md).[`IPrintable`](IPrintable.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [src/common/interfaces/IChainInfo.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IChainInfo.ts#L15)

Signature to differentiate from similar interfaces

***

### chainId

```ts
readonly chainId: ChainId;
```

Defined in: [src/common/interfaces/IChainInfo.ts:17](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IChainInfo.ts#L17)

The chain ID of the network

#### Overrides

```ts
IChainInfoData.chainId
```

***

### name

```ts
readonly name: string;
```

Defined in: [src/common/interfaces/IChainInfo.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IChainInfo.ts#L19)

The name of the network

#### Overrides

```ts
IChainInfoData.name
```

## Methods

### equals()

```ts
equals(chainInfo): boolean;
```

Defined in: [src/common/interfaces/IChainInfo.ts:29](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IChainInfo.ts#L29)

Checks if two chain infos are equal

#### Parameters

##### chainInfo

[`IChainInfoData`](../type-aliases/IChainInfoData.md)

The chain info to compare

#### Returns

`boolean`

true if the chain infos are equal

Equality is determined by the chain ID

***

### toString()

```ts
toString(): string;
```

Defined in: [src/common/interfaces/IPrintable.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPrintable.ts#L14)

Returns a string representation of the object

#### Returns

`string`

string

The string representation should have enough info to debug the object

#### Inherited from

[`IPrintable`](IPrintable.md).[`toString`](IPrintable.md#tostring)

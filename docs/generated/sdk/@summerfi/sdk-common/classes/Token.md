# Class: Token

Defined in: [sdk/sdk-common/src/common/implementation/Token.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/Token.ts#L18)

## Name

Token

## See

IToken

## Implements

- [`ITokenStanalone`](../interfaces/ITokenStanalone.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol = __signature__;
```

Defined in: [sdk/sdk-common/src/common/implementation/Token.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/Token.ts#L20)

SIGNATURE

#### Implementation of

[`ITokenStanalone`](../interfaces/ITokenStanalone.md).[`[___signature__]`](../interfaces/ITokenStanalone.md#___signature__)

***

### address

```ts
readonly address: IAddress;
```

Defined in: [sdk/sdk-common/src/common/implementation/Token.ts:26](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/Token.ts#L26)

Token address

#### Implementation of

[`ITokenStanalone`](../interfaces/ITokenStanalone.md).[`address`](../interfaces/ITokenStanalone.md#address)

***

### chainInfo

```ts
readonly chainInfo: IChainInfo;
```

Defined in: [sdk/sdk-common/src/common/implementation/Token.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/Token.ts#L25)

Chain where the token is deployed

#### Implementation of

[`ITokenStanalone`](../interfaces/ITokenStanalone.md).[`chainInfo`](../interfaces/ITokenStanalone.md#chaininfo)

***

### decimals

```ts
readonly decimals: number;
```

Defined in: [sdk/sdk-common/src/common/implementation/Token.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/Token.ts#L27)

Number of decimals for the token

#### Implementation of

[`ITokenStanalone`](../interfaces/ITokenStanalone.md).[`decimals`](../interfaces/ITokenStanalone.md#decimals)

***

### name

```ts
readonly name: string;
```

Defined in: [sdk/sdk-common/src/common/implementation/Token.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/Token.ts#L24)

Full token name

#### Implementation of

[`ITokenStanalone`](../interfaces/ITokenStanalone.md).[`name`](../interfaces/ITokenStanalone.md#name)

***

### symbol

```ts
readonly symbol: string;
```

Defined in: [sdk/sdk-common/src/common/implementation/Token.ts:23](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/Token.ts#L23)

ATTRIBUTES

#### Implementation of

[`ITokenStanalone`](../interfaces/ITokenStanalone.md).[`symbol`](../interfaces/ITokenStanalone.md#symbol)

## Methods

### equals()

```ts
equals(token): boolean;
```

Defined in: [sdk/sdk-common/src/common/implementation/Token.ts:57](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/Token.ts#L57)

#### Parameters

##### token

`Token`

#### Returns

`boolean`

#### See

IToken.equals

#### Implementation of

[`ITokenStanalone`](../interfaces/ITokenStanalone.md).[`equals`](../interfaces/ITokenStanalone.md#equals)

***

### toString()

```ts
toString(): string;
```

Defined in: [sdk/sdk-common/src/common/implementation/Token.ts:62](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/Token.ts#L62)

#### Returns

`string`

#### See

IPrintable.toString

#### Implementation of

[`ITokenStanalone`](../interfaces/ITokenStanalone.md).[`toString`](../interfaces/ITokenStanalone.md#tostring)

***

### createFrom()

```ts
static createFrom(params): Token;
```

Defined in: [sdk/sdk-common/src/common/implementation/Token.ts:30](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/Token.ts#L30)

FACTORY

#### Parameters

##### params

[`TokenParameters`](../type-aliases/TokenParameters.md)

#### Returns

`Token`

***

### createFromEthereum()

```ts
static createFromEthereum(params): Token;
```

Defined in: [sdk/sdk-common/src/common/implementation/Token.ts:34](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/implementation/Token.ts#L34)

#### Parameters

##### params

`Omit`\<[`TokenParameters`](../type-aliases/TokenParameters.md), `"chainInfo"` \| `"address"`\> & `object`

#### Returns

`Token`

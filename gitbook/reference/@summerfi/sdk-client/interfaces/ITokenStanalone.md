# Interface: ITokenStanalone

Defined in: [../sdk-common/src/common/interfaces/IToken.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IToken.ts#L14)

Represents an token in a Chain, typically used to represent ERC-20 tokens

## Extends

- [`ITokenData`](../type-aliases/ITokenData.md).[`IPrintable`](IPrintable.md)

## Properties

### \[\_\_\_signature\_\_\]

```ts
readonly [___signature__]: symbol;
```

Defined in: [../sdk-common/src/common/interfaces/IToken.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IToken.ts#L16)

Signature to differentiate from similar interfaces

***

### address

```ts
readonly address: IAddress;
```

Defined in: [../sdk-common/src/common/interfaces/IToken.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IToken.ts#L20)

Token address

#### Overrides

```ts
ITokenData.address
```

***

### chainInfo

```ts
readonly chainInfo: IChainInfo;
```

Defined in: [../sdk-common/src/common/interfaces/IToken.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IToken.ts#L18)

Chain where the token is deployed

#### Overrides

```ts
ITokenData.chainInfo
```

***

### decimals

```ts
readonly decimals: number;
```

Defined in: [../sdk-common/src/common/interfaces/IToken.ts:26](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IToken.ts#L26)

Number of decimals for the token

#### Overrides

```ts
ITokenData.decimals
```

***

### name

```ts
readonly name: string;
```

Defined in: [../sdk-common/src/common/interfaces/IToken.ts:24](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IToken.ts#L24)

Full token name

#### Overrides

```ts
ITokenData.name
```

***

### symbol

```ts
readonly symbol: string;
```

Defined in: [../sdk-common/src/common/interfaces/IToken.ts:22](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IToken.ts#L22)

Token symbol, usually a short representation of name and used in tickers

#### Overrides

```ts
ITokenData.symbol
```

## Methods

### equals()

```ts
equals(token): boolean;
```

Defined in: [../sdk-common/src/common/interfaces/IToken.ts:36](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IToken.ts#L36)

Checks if two tokens are equal

#### Parameters

##### token

`IToken`

The token to compare

#### Returns

`boolean`

true if the tokens are equal

Equality is determined by the address and chain information

***

### toString()

```ts
toString(): string;
```

Defined in: [../sdk-common/src/common/interfaces/IPrintable.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IPrintable.ts#L14)

Returns a string representation of the object

#### Returns

`string`

string

The string representation should have enough info to debug the object

#### Inherited from

[`IPrintable`](IPrintable.md).[`toString`](IPrintable.md#tostring)

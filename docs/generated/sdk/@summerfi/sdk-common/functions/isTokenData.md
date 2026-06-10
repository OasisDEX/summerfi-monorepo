# Function: isTokenData()

```ts
function isTokenData(maybeTokenData): maybeTokenData is Readonly<{ address: { type: AddressType; value: `0x${string}` }; chainInfo: { chainId: 1 | 10 | 146 | 999 | 8453 | 42161; name: string }; decimals: number; name: string; symbol: string }>;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IToken.ts:70](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/interfaces/IToken.ts#L70)

## Parameters

### maybeTokenData

`unknown`

## Returns

maybeTokenData is Readonly\<\{ address: \{ type: AddressType; value: \`0x$\{string\}\` \}; chainInfo: \{ chainId: 1 \| 10 \| 146 \| 999 \| 8453 \| 42161; name: string \}; decimals: number; name: string; symbol: string \}\>

true if the object is an ITokenData

## Description

Type guard for ITokenData

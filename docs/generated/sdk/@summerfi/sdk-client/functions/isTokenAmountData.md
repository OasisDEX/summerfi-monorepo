# Function: isTokenAmountData()

```ts
function isTokenAmountData(maybeTokenAmount): maybeTokenAmount is Readonly<{ amount: string; token: ITokenStanalone }>;
```

Defined in: [sdk/sdk-common/src/common/interfaces/ITokenAmount.ts:164](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/interfaces/ITokenAmount.ts#L164)

## Parameters

### maybeTokenAmount

`unknown`

## Returns

`maybeTokenAmount is Readonly<{ amount: string; token: ITokenStanalone }>`

true if the object is an ITokenAmountData

## Description

Type guard for ITokenAmountData

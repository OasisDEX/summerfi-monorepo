# Function: isTokenAmountData()

```ts
function isTokenAmountData(maybeTokenAmount): maybeTokenAmount is Readonly<{ amount: string; token: ITokenStanalone }>;
```

Defined in: [src/common/interfaces/ITokenAmount.ts:161](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/ITokenAmount.ts#L161)

Type guard for ITokenAmountData

## Parameters

### maybeTokenAmount

`unknown`

## Returns

`maybeTokenAmount is Readonly<{ amount: string; token: ITokenStanalone }>`

true if the object is an ITokenAmountData

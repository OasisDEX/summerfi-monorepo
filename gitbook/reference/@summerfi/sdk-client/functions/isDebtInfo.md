# Function: isDebtInfo()

```ts
function isDebtInfo(maybeDebtInfo): maybeDebtInfo is Readonly<{ debtAvailable: ITokenAmount; debtCeiling: ITokenAmount; dustLimit: ITokenAmount; interestRate: IPercentage; originationFee: IPercentage; price: IPrice; priceUSD: IPrice; token: ITokenStanalone; totalBorrowed: ITokenAmount }>;
```

Defined in: [../sdk-common/src/lending-protocols/interfaces/IDebtInfo.ts:67](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/IDebtInfo.ts#L67)

Type guard for IDebtInfo

## Parameters

### maybeDebtInfo

`unknown`

## Returns

`maybeDebtInfo is Readonly<{ debtAvailable: ITokenAmount; debtCeiling: ITokenAmount; dustLimit: ITokenAmount; interestRate: IPercentage; originationFee: IPercentage; price: IPrice; priceUSD: IPrice; token: ITokenStanalone; totalBorrowed: ITokenAmount }>`

true if the object is an IDebtInfo

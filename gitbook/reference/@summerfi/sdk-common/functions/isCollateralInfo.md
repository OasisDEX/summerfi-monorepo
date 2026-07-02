# Function: isCollateralInfo()

```ts
function isCollateralInfo(maybeCollateralInfo): maybeCollateralInfo is Readonly<{ liquidationPenalty: IPercentage; liquidationThreshold: IRiskRatio; maxSupply: ITokenAmount; price: IPrice; priceUSD: IPrice; token: ITokenStanalone; tokensLocked: ITokenAmount }>;
```

Defined in: [src/lending-protocols/interfaces/ICollateralInfo.ts:59](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/lending-protocols/interfaces/ICollateralInfo.ts#L59)

Type guard for ICollateralInfo

## Parameters

### maybeCollateralInfo

`unknown`

## Returns

`maybeCollateralInfo is Readonly<{ liquidationPenalty: IPercentage; liquidationThreshold: IRiskRatio; maxSupply: ITokenAmount; price: IPrice; priceUSD: IPrice; token: ITokenStanalone; tokensLocked: ITokenAmount }>`

true if the object is an ICollateralInfo

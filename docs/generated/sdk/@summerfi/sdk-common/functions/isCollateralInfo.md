# Function: isCollateralInfo()

```ts
function isCollateralInfo(maybeCollateralInfo): maybeCollateralInfo is Readonly<{ liquidationPenalty: IPercentage; liquidationThreshold: IRiskRatio; maxSupply: ITokenAmount; price: IPrice; priceUSD: IPrice; token: ITokenStanalone; tokensLocked: ITokenAmount }>;
```

Defined in: [sdk/sdk-common/src/lending-protocols/interfaces/ICollateralInfo.ts:59](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/lending-protocols/interfaces/ICollateralInfo.ts#L59)

## Parameters

### maybeCollateralInfo

`unknown`

## Returns

`maybeCollateralInfo is Readonly<{ liquidationPenalty: IPercentage; liquidationThreshold: IRiskRatio; maxSupply: ITokenAmount; price: IPrice; priceUSD: IPrice; token: ITokenStanalone; tokensLocked: ITokenAmount }>`

true if the object is an ICollateralInfo

## Description

Type guard for ICollateralInfo

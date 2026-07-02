# Function: calculatePriceImpact()

```ts
function calculatePriceImpact(spotPrice, quotePrice): IPercentage | null;
```

Defined in: [../sdk-common/src/swap/calculatePriceImpact.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/swap/calculatePriceImpact.ts#L16)

Computes the price impact of a swap as the percentage by which the quoted price deviates from the
spot price.

## Parameters

### spotPrice

[`IPrice`](../interfaces/IPrice.md)

This price represents a blend of spot prices from various exchanges.

### quotePrice

[`IPrice`](../interfaces/IPrice.md)

The offer price is price quoted to us by a liquidity provider and takes
     into account price impact - where price impact is a measure of how much our trade
     affects the price. It is determined by the breadth and depth of liquidity.

## Returns

[`IPercentage`](../interfaces/IPercentage.md) \| `null`

The price impact as a percentage (never negative), or `null` when either price is zero
     or negative.

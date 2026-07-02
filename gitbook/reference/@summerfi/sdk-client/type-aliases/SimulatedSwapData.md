# Type Alias: SimulatedSwapData

```ts
type SimulatedSwapData = Omit<QuoteDataStanalone, "estimatedGas" | "routes"> & object;
```

Defined in: [../sdk-common/src/swap/implementation/SimulatedSwapData.ts:11](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/swap/implementation/SimulatedSwapData.ts#L11)

Represents the data returned for each Swap in simulation.
It is derived from the `QuoteData` type with the `estimatedGas` and 'routes' fields omitted,
as gas estimation is not relevant for simulation purposes.

## Type Declaration

### offerPrice

```ts
offerPrice: IPrice;
```

### priceImpact

```ts
priceImpact: IPercentage | null;
```

### slippage

```ts
slippage: IPercentage;
```

### spotPrice

```ts
spotPrice: IPrice;
```

### summerFee

```ts
summerFee: ITokenAmount;
```

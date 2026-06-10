# Variable: RefinanceSimulationSchema

```ts
const RefinanceSimulationSchema: ZodObject<{
  sourcePosition: ZodType<ILendingPosition, ZodTypeDef, ILendingPosition>;
  steps: ZodArray<ZodType<Steps, ZodTypeDef, Steps>, "many">;
  swaps: ZodArray<ZodType<SimulatedSwapData, ZodTypeDef, SimulatedSwapData>, "many">;
  targetPosition: ZodType<ILendingPosition, ZodTypeDef, ILendingPosition>;
  type: ZodLiteral<Refinance>;
}, "strip", ZodTypeAny, {
  sourcePosition: ILendingPosition;
  steps: Steps[];
  swaps: SimulatedSwapData[];
  targetPosition: ILendingPosition;
  type: Refinance;
}, {
  sourcePosition: ILendingPosition;
  steps: Steps[];
  swaps: SimulatedSwapData[];
  targetPosition: ILendingPosition;
  type: Refinance;
}>;
```

Defined in: [sdk/sdk-common/src/simulation/interfaces/IRefinanceSimulation.ts:39](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/simulation/interfaces/IRefinanceSimulation.ts#L39)

## Description

Zod schema for IRefinanceSimulation

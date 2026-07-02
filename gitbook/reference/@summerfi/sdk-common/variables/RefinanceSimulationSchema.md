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

Defined in: [src/simulation/interfaces/IRefinanceSimulation.ts:38](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/simulation/interfaces/IRefinanceSimulation.ts#L38)

Zod schema for IRefinanceSimulation

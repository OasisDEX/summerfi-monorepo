# Variable: RiskRatioDataSchema

```ts
const RiskRatioDataSchema: ZodObject<{
  type: ZodNativeEnum<typeof RiskRatioType>;
  value: ZodUnion<[ZodObject<{
     value: ZodNumber;
   }, "strip", ZodTypeAny, {
     value: number;
   }, {
     value: number;
  }>, ZodNumber]>;
}, "strip", ZodTypeAny, {
  type: RiskRatioType;
  value:   | number
     | {
     value: number;
   };
}, {
  type: RiskRatioType;
  value:   | number
     | {
     value: number;
   };
}>;
```

Defined in: [src/common/interfaces/IRiskRatio.ts:46](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/interfaces/IRiskRatio.ts#L46)

Zod schema for IRiskRatioData

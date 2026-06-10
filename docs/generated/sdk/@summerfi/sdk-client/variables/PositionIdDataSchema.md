# Variable: PositionIdDataSchema

```ts
const PositionIdDataSchema: ZodObject<{
  id: ZodString;
  type: ZodNativeEnum<typeof PositionType>;
}, "strip", ZodTypeAny, {
  id: string;
  type: PositionType;
}, {
  id: string;
  type: PositionType;
}>;
```

Defined in: [sdk/sdk-common/src/common/interfaces/IPositionId.ts:25](https://github.com/OasisDEX/summerfi-monorepo/blob/c90dd64090f5d38a9f718ea2493feda7b50f1be9/sdk/sdk-common/src/common/interfaces/IPositionId.ts#L25)

## Description

Zod schema for IPositionId

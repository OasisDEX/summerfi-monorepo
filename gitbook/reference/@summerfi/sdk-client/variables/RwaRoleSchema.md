# Variable: RwaRoleSchema

```ts
const RwaRoleSchema: ZodUnion<[ZodObject<{
  kind: ZodLiteral<"GOVERNOR">;
}, "strip", ZodTypeAny, {
  kind: "GOVERNOR";
}, {
  kind: "GOVERNOR";
}>, ZodObject<{
  kind: ZodLiteral<"SUPER_KEEPER">;
}, "strip", ZodTypeAny, {
  kind: "SUPER_KEEPER";
}, {
  kind: "SUPER_KEEPER";
}>, ZodObject<{
  kind: ZodLiteral<"GUARDIAN">;
}, "strip", ZodTypeAny, {
  kind: "GUARDIAN";
}, {
  kind: "GUARDIAN";
}>, ZodObject<{
  kind: ZodLiteral<"DECAY_CONTROLLER">;
}, "strip", ZodTypeAny, {
  kind: "DECAY_CONTROLLER";
}, {
  kind: "DECAY_CONTROLLER";
}>]>;
```

Defined in: [../sdk-common/src/common/types/RwaRole.ts:36](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/types/RwaRole.ts#L36)

## Name

RwaRoleSchema

## Description

Zod schema for [RwaRole](../type-aliases/RwaRole.md), used to validate the role descriptor at the tRPC boundary.

# Type Alias: UnsignedOrder

```ts
type UnsignedOrder = Omit<OrderParameters, "receiver"> & object;
```

Defined in: [../../node\_modules/.pnpm/@cowprotocol+sdk-order-signing@0.3.0/node\_modules/@cowprotocol/sdk-order-signing/dist/index.d.ts:9](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/npm/@cowprotocol+sdk-order-signing@0.3.0/node_modules/@cowprotocol/sdk-order-signing/dist/index.d.ts#L9)

Unsigned order intent to be placed.

## Type Declaration

### receiver

```ts
receiver: string;
```

# Type Alias: Permit2SubAllowanceTransactionInfo

```ts
type Permit2SubAllowanceTransactionInfo = TransactionInfo & object;
```

Defined in: [src/orders/common/types/TransactionInfo.ts:181](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/types/TransactionInfo.ts#L181)

Transaction info for granting a Permit2 sub-allowance (`PERMIT2.approve(token, spender, amount,
expiration)`) — the recurring allowance a spender (e.g. the DCA strategy manager's keeper) draws
down via Permit2 `AllowanceTransfer`.

## Type Declaration

### type

```ts
type: Permit2SubAllowance;
```

# Interface: TransactionInfo

Defined in: [src/orders/common/types/TransactionInfo.ts:47](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/types/TransactionInfo.ts#L47)

Contains the low level transaction plus a description of what the transaction is for.
This could be used to display the transaction to the user.

## Properties

### description

```ts
description: string;
```

Defined in: [src/orders/common/types/TransactionInfo.ts:51](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/types/TransactionInfo.ts#L51)

High-level description of the transaction

***

### transaction

```ts
transaction: Transaction;
```

Defined in: [src/orders/common/types/TransactionInfo.ts:49](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/types/TransactionInfo.ts#L49)

Low level transaction that can be sent to the blockchain

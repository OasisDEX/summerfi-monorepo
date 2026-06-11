# Interface: TransactionInfo

Defined in: [src/orders/common/types/TransactionInfo.ts:48](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/types/TransactionInfo.ts#L48)

TransactionInfo

## Description

Contains the low level transaction plus a description of what the transaction is for.
             This could be used to display the transaction to the user.

## Properties

### description

```ts
description: string;
```

Defined in: [src/orders/common/types/TransactionInfo.ts:52](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/types/TransactionInfo.ts#L52)

#### Description

High-level description of the transaction

***

### transaction

```ts
transaction: Transaction;
```

Defined in: [src/orders/common/types/TransactionInfo.ts:50](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/types/TransactionInfo.ts#L50)

#### Description

Low level transaction that can be sent to the blockchain

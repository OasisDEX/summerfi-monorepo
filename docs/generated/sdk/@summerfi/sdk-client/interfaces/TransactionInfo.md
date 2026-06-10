# Interface: TransactionInfo

Defined in: [sdk/sdk-common/src/orders/common/types/TransactionInfo.ts:48](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/orders/common/types/TransactionInfo.ts#L48)

TransactionInfo

## Description

Contains the low level transaction plus a description of what the transaction is for.
             This could be used to display the transaction to the user.

## Properties

### description

```ts
description: string;
```

Defined in: [sdk/sdk-common/src/orders/common/types/TransactionInfo.ts:52](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/orders/common/types/TransactionInfo.ts#L52)

#### Description

High-level description of the transaction

***

### transaction

```ts
transaction: Transaction;
```

Defined in: [sdk/sdk-common/src/orders/common/types/TransactionInfo.ts:50](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/orders/common/types/TransactionInfo.ts#L50)

#### Description

Low level transaction that can be sent to the blockchain

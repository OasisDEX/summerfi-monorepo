# Interface: IPositionsManager

Defined in: [src/orders/common/interfaces/IPositionsManager.ts:10](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/interfaces/IPositionsManager.ts#L10)

## Name

IPositionsManager

## Description

Interface for the positions manager (DPM)

The Positions Manager is the proxy used to interact with the Summer.fi system. It is used as Smart Account for the user.

## Extends

- [`IPositionsManagerData`](../type-aliases/IPositionsManagerData.md)

## Properties

### address

```ts
readonly address: IAddress;
```

Defined in: [src/orders/common/interfaces/IPositionsManager.ts:12](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/orders/common/interfaces/IPositionsManager.ts#L12)

Address of the Positions Manager

#### Overrides

```ts
IPositionsManagerData.address
```

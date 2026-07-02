# Enumeration: RoundState

Defined in: [src/common/enums/RoundState.ts:8](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/enums/RoundState.ts#L8)

RoundState

## Description

Represents the lifecycle state of a RoundsVault round.
             Mirrors the on-chain `RoundState` enum in RoundsVaultBase.sol.

## Enumeration Members

### InSettlement

```ts
InSettlement: 2;
```

Defined in: [src/common/enums/RoundState.ts:14](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/enums/RoundState.ts#L14)

Round has been closed by the Keeper, pending settlement

***

### NotOpened

```ts
NotOpened: 0;
```

Defined in: [src/common/enums/RoundState.ts:10](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/enums/RoundState.ts#L10)

EVM default — the round has never been opened

***

### Opened

```ts
Opened: 1;
```

Defined in: [src/common/enums/RoundState.ts:12](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/enums/RoundState.ts#L12)

Round is accepting deposits and current-round redemptions

***

### Settled

```ts
Settled: 3;
```

Defined in: [src/common/enums/RoundState.ts:16](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/enums/RoundState.ts#L16)

Settlement complete — exchange-asset redemptions are now available

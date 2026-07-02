# Enumeration: RoundState

Defined in: [../sdk-common/src/common/enums/RoundState.ts:7](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/enums/RoundState.ts#L7)

Represents the lifecycle state of a RoundsVault round.
Mirrors the on-chain `RoundState` enum in RoundsVaultBase.sol.

## Enumeration Members

### InSettlement

```ts
InSettlement: 2;
```

Defined in: [../sdk-common/src/common/enums/RoundState.ts:13](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/enums/RoundState.ts#L13)

Round has been closed by the Keeper, pending settlement

***

### NotOpened

```ts
NotOpened: 0;
```

Defined in: [../sdk-common/src/common/enums/RoundState.ts:9](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/enums/RoundState.ts#L9)

EVM default — the round has never been opened

***

### Opened

```ts
Opened: 1;
```

Defined in: [../sdk-common/src/common/enums/RoundState.ts:11](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/enums/RoundState.ts#L11)

Round is accepting deposits and current-round redemptions

***

### Settled

```ts
Settled: 3;
```

Defined in: [../sdk-common/src/common/enums/RoundState.ts:15](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/enums/RoundState.ts#L15)

Settlement complete — exchange-asset redemptions are now available

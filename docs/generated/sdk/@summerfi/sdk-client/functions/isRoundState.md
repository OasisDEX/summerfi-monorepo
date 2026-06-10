# Function: isRoundState()

```ts
function isRoundState(maybeRoundState): maybeRoundState is RoundState;
```

Defined in: [sdk/sdk-common/src/common/enums/RoundState.ts:28](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-common/src/common/enums/RoundState.ts#L28)

Type guard that checks whether a value is a valid [RoundState](../enumerations/RoundState.md).

## Parameters

### maybeRoundState

`unknown`

The value to test.

## Returns

`maybeRoundState is RoundState`

`true` if the value is a [RoundState](../enumerations/RoundState.md), narrowing its type.

# Function: isRoundState()

```ts
function isRoundState(maybeRoundState): maybeRoundState is RoundState;
```

Defined in: [src/common/enums/RoundState.ts:27](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/enums/RoundState.ts#L27)

Type guard that checks whether a value is a valid [RoundState](../enumerations/RoundState.md).

## Parameters

### maybeRoundState

`unknown`

The value to test.

## Returns

`maybeRoundState is RoundState`

`true` if the value is a [RoundState](../enumerations/RoundState.md), narrowing its type.

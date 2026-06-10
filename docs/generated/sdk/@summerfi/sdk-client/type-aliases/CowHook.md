# Type Alias: CowHook

```ts
type CowHook = object;
```

Defined in: [sdk/sdk-client/src/interfaces/IIntentSwapClient.ts:18](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/interfaces/IIntentSwapClient.ts#L18)

A CoW Protocol pre- or post-interaction hook: an arbitrary call (`target` + `callData`) executed
around a swap order, with an associated `gasLimit`.

## Properties

### callData

```ts
callData: HexData;
```

Defined in: [sdk/sdk-client/src/interfaces/IIntentSwapClient.ts:20](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/interfaces/IIntentSwapClient.ts#L20)

***

### gasLimit

```ts
gasLimit: string;
```

Defined in: [sdk/sdk-client/src/interfaces/IIntentSwapClient.ts:21](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/interfaces/IIntentSwapClient.ts#L21)

***

### target

```ts
target: HexData;
```

Defined in: [sdk/sdk-client/src/interfaces/IIntentSwapClient.ts:19](https://github.com/OasisDEX/summerfi-monorepo/blob/1ef6231288fcd880252de20d0ddd07a0cdcc78fa/sdk/sdk-client/src/interfaces/IIntentSwapClient.ts#L19)

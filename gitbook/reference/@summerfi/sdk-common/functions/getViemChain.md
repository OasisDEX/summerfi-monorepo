# Function: getViemChain()

```ts
function getViemChain(chainId): 
  | {
}
  | {
}
  | {
}
  | {
}
  | {
  blockExplorers: {
     default: {
        apiUrl: "https://api.hyperevmscan.io/api";
        name: "HyperEVMScan";
        url: "https://hyperevmscan.io";
     };
  };
  contracts: {
     multicall3: {
        address: "0xca11bde05977b3631167028862be2a173976ca11";
        blockCreated: 13051;
     };
  };
  id: 999;
  name: "HyperEVM";
  nativeCurrency: {
     decimals: 18;
     name: "HYPE";
     symbol: "HYPE";
  };
  rpcUrls: {
     default: {
        http: readonly ["https://rpc.hyperliquid.xyz/evm"];
     };
  };
};
```

Defined in: [src/common/utils/getViemChain.ts:36](https://github.com/OasisDEX/summerfi-monorepo/blob/dev/src/common/utils/getViemChain.ts#L36)

Resolves the viem chain definition for a supported chain id.

## Parameters

### chainId

[`ChainId`](../type-aliases/ChainId.md)

The chain id to resolve.

## Returns

```ts
{
}
```

```ts
{
}
```

```ts
{
}
```

```ts
{
}
```

```ts
{
  blockExplorers: {
     default: {
        apiUrl: "https://api.hyperevmscan.io/api";
        name: "HyperEVMScan";
        url: "https://hyperevmscan.io";
     };
  };
  contracts: {
     multicall3: {
        address: "0xca11bde05977b3631167028862be2a173976ca11";
        blockCreated: 13051;
     };
  };
  id: 999;
  name: "HyperEVM";
  nativeCurrency: {
     decimals: 18;
     name: "HYPE";
     symbol: "HYPE";
  };
  rpcUrls: {
     default: {
        http: readonly ["https://rpc.hyperliquid.xyz/evm"];
     };
  };
}
```

### blockExplorers

```ts
blockExplorers: object;
```

Collection of block explorers

#### blockExplorers.default

```ts
readonly default: object;
```

#### blockExplorers.default.apiUrl

```ts
readonly apiUrl: "https://api.hyperevmscan.io/api" = 'https://api.hyperevmscan.io/api';
```

#### blockExplorers.default.name

```ts
readonly name: "HyperEVMScan" = 'HyperEVMScan';
```

#### blockExplorers.default.url

```ts
readonly url: "https://hyperevmscan.io" = 'https://hyperevmscan.io';
```

### contracts

```ts
contracts: object;
```

Collection of contracts

#### contracts.multicall3

```ts
readonly multicall3: object;
```

#### contracts.multicall3.address

```ts
readonly address: "0xca11bde05977b3631167028862be2a173976ca11" = '0xca11bde05977b3631167028862be2a173976ca11';
```

#### contracts.multicall3.blockCreated

```ts
readonly blockCreated: 13051 = 13051;
```

### id

```ts
id: 999;
```

ID in number form

### name

```ts
name: "HyperEVM";
```

Human-readable name

### nativeCurrency

```ts
nativeCurrency: object;
```

Currency used by chain

#### nativeCurrency.decimals

```ts
readonly decimals: 18 = 18;
```

#### nativeCurrency.name

```ts
readonly name: "HYPE" = 'HYPE';
```

#### nativeCurrency.symbol

```ts
readonly symbol: "HYPE" = 'HYPE';
```

### rpcUrls

```ts
rpcUrls: object;
```

Collection of RPC endpoints

#### rpcUrls.default

```ts
readonly default: object;
```

#### rpcUrls.default.http

```ts
readonly http: readonly ["https://rpc.hyperliquid.xyz/evm"];
```

The matching viem chain definition.

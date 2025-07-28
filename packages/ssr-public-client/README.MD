# @summerfi/ssr-public-client

A lightweight, server-side rendering (SSR) optimized public client for blockchain interactions in
the Summer.fi ecosystem. This package provides cached Viem public clients for multiple blockchain
networks with optimized RPC gateway integration.

## Features

- **SSR Optimized**: Designed for server-side rendering with efficient client caching
- **Multi-Chain Support**: Supports Ethereum Mainnet, Base, Arbitrum, and Sonic networks
- **RPC Gateway Integration**: Uses Summer.fi's RPC gateway for optimized blockchain access
- **TypeScript Support**: Full TypeScript support with proper type definitions
- **Caching**: In-memory client caching for improved performance
- **Error Handling**: Robust error handling for unsupported networks

## Installation

```bash
pnpm install @summerfi/ssr-public-client
```

## Usage

### Basic Usage

```typescript
import { getSSRPublicClient } from '@summerfi/ssr-public-client'
import { SupportedNetworkIds } from '@summerfi/app-types'

// Get a public client for Ethereum Mainnet
const mainnetClient = await getSSRPublicClient(SupportedNetworkIds.Mainnet)

// Get a public client for Base
const baseClient = await getSSRPublicClient(SupportedNetworkIds.Base)

// Get a public client for Arbitrum
const arbitrumClient = await getSSRPublicClient(SupportedNetworkIds.ArbitrumOne)

// Get a public client for Sonic
const sonicClient = await getSSRPublicClient(SupportedNetworkIds.SonicMainnet)
```

### Environment Configuration

Set the `RPC_GATEWAY` environment variable to your RPC gateway URL:

```bash
RPC_GATEWAY=https://your-rpc-gateway-url.com
```

### Supported Networks

| Network          | Chain ID                           | Description             |
| ---------------- | ---------------------------------- | ----------------------- |
| Ethereum Mainnet | `SupportedNetworkIds.Mainnet`      | Ethereum main network   |
| Base             | `SupportedNetworkIds.Base`         | Base L2 network         |
| Arbitrum         | `SupportedNetworkIds.ArbitrumOne`  | Arbitrum One L2 network |
| Sonic            | `SupportedNetworkIds.SonicMainnet` | Sonic network           |

## API Reference

### `getSSRPublicClient(chainId: SupportedNetworkIds): Promise<PublicClient | undefined>`

Returns a cached Viem public client for the specified blockchain network.

**Parameters:**

- `chainId` - The SDK chain ID for the target network

**Returns:**

- `Promise<PublicClient | undefined>` - A Viem public client instance or undefined if the network is
  not supported

**Throws:**

- `Error` - If the chain ID is not found or RPC gateway URL is not configured

## RPC Gateway Configuration

The package uses Summer.fi's RPC gateway with the following default configuration:

- **skipCache**: `false` - Enables response caching
- **skipMulticall**: `false` - Enables multicall optimization
- **skipGraph**: `true` - Disables GraphQL queries
- **stage**: `'prod'` - Production environment
- **source**: `'borrow-prod'` - Source identifier

## Development

### Building

```bash
pnpm run build
```

### Development Mode

```bash
pnpm run dev
```

### Linting

```bash
pnpm run lint
```

### Clean Build

```bash
pnpm run clean
```

## Contributing

This package is part of the Summer.fi monorepo. Please refer to the main repository for contribution
guidelines.

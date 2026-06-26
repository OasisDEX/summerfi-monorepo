/**
 * Test stub for `@summerfi/serverless-shared`, which ships ESM-only and cannot
 * be `require`d by this package's CJS ts-jest transform. Mapped in via
 * `moduleNameMapper` in jest.config.js. Only the surface the fetchers use at
 * runtime is reproduced here; types still resolve from the real package.
 */
export enum ChainId {
  MAINNET = 1,
  ARBITRUM = 42161,
  BASE = 8453,
}

export interface IRpcConfig {
  skipCache: boolean
  skipMulticall: boolean
  skipGraph: boolean
  stage: string
  source: string
}

export function getRpcGatewayEndpoint(rpcGatewayUrl: string, chainId: ChainId): string {
  // The real signature also takes an IRpcConfig; the stub ignores it (extra
  // call args are dropped at runtime), so it is omitted to satisfy lint.
  return `${rpcGatewayUrl}/?chainId=${chainId}`
}

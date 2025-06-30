import { ChainId } from '@summerfi/serverless-shared'

export const supportedChainIds = [ChainId.MAINNET] as const
export type SupportedChainIds = (typeof supportedChainIds)[number]

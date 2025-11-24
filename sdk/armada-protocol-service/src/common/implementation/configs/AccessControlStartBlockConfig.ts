// Start blocks for event fetching per chain for Access Control
// Update this file to change the start block for any supported chain
// Key: ChainId (number), Value: Start block (bigint)

export const AccessControlStartBlockConfig: Partial<Record<number, bigint>> = {
  8453: 33275700n, // Base chain
  42161: 33275700n, // Arbitrum One chain
}

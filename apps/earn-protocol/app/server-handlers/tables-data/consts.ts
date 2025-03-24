// Smaller batch size for database inserts
export const DB_BATCH_SIZE = 500

// Larger batch size for subgraph queries
export const SUBGRAPH_BATCH_SIZE = 1000

// filter out testing wallets
export const userAddresesToFilterOut = [
  '0xaf2227f40445982959c56e1421a0855209f6470e',
  '0xddc68f9de415ba2fe2fd84bc62be2d2cff1098da',
  '0xbef4befb4f230f43905313077e3824d7386e09f8',
  '0x10649c79428d718621821cf6299e91920284743f',
]

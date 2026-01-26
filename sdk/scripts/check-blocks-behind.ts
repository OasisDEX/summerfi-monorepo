import { config } from '@dotenvx/dotenvx'

config({ path: ['../.env', '.env'], override: true, debug: false })

const SUBGRAPH_BASE = process.env.SUBGRAPH_BASE

if (!SUBGRAPH_BASE) {
  throw new Error('Missing env var SUBGRAPH_BASE')
}

const subgraphs = [
  'summer-protocol',
  'summer-protocol-base',
  'summer-protocol-arbitrum',
  'summer-protocol-sonic',
  'summer-protocol-hyperliquid',
]

// ---------------------------------------------------------
// 1. Chain detection based on subgraph name
// ---------------------------------------------------------
function detectChain(name: string): string {
  if (name.includes('arbitrum')) return 'arbitrum'
  if (name.includes('base')) return 'base'
  if (name.includes('sonic')) return 'sonic'
  if (name.includes('hyperliquid')) return 'hyperliquid'

  // default chain for "summer-protocol"
  return 'ethereum'
}

// ---------------------------------------------------------
// 2. RPC mapping per chain
// ---------------------------------------------------------
const RPC_BY_CHAIN: Record<string, string> = {
  ethereum: process.env.E2E_SDK_FORK_URL_MAINNET!,
  base: process.env.E2E_SDK_FORK_URL_BASE!,
  arbitrum: process.env.E2E_SDK_FORK_URL_ARBITRUM!,
  sonic: process.env.E2E_SDK_FORK_URL_SONIC!,
  hyperliquid: process.env.E2E_SDK_FORK_URL_HYPERLIQUID!,
}

// ---------------------------------------------------------
// 3. Fetch indexed block from Goldsky subgraph
// ---------------------------------------------------------
async function fetchIndexedBlock(url: string): Promise<number> {
  const query = {
    query: `
      {
        _meta {
          block {
            number
          }
        }
      }
    `,
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query),
  })

  if (!res.ok) {
    throw new Error(`Subgraph query failed: ${res.status} ${res.statusText}`)
  }

  const json = await res.json()
  return json.data._meta.block.number
}

// ---------------------------------------------------------
// 4. Fetch current block from chain RPC
// ---------------------------------------------------------
async function fetchCurrentBlock(rpcUrl: string): Promise<number> {
  const payload = {
    jsonrpc: '2.0',
    method: 'eth_blockNumber',
    params: [],
    id: 1,
  }

  const res = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    throw new Error(`RPC call failed: ${res.status} ${res.statusText}`)
  }

  const json = await res.json()
  return parseInt(json.result, 16)
}

// ---------------------------------------------------------
// 5. Check a single subgraph
// ---------------------------------------------------------
async function checkSubgraph(name: string) {
  const chain = detectChain(name)
  const rpcUrl = RPC_BY_CHAIN[chain]

  if (!rpcUrl) {
    return {
      name,
      error: `No RPC mapping for chain: ${chain}`,
    }
  }

  const url = `${SUBGRAPH_BASE}/${name}`

  try {
    const [indexedBlock, currentBlock] = await Promise.all([
      fetchIndexedBlock(url),
      fetchCurrentBlock(rpcUrl),
    ])

    const behind = currentBlock - indexedBlock

    return {
      name,
      chain,
      indexedBlock,
      currentBlock,
      behind,
    }
  } catch (err) {
    return {
      name,
      chain,
      error: (err as Error).message,
    }
  }
}

// ---------------------------------------------------------
// 6. Main
// ---------------------------------------------------------
async function main() {
  const results = await Promise.all(subgraphs.map(checkSubgraph))

  for (const r of results) {
    if ('error' in r) {
      console.log(`${r.name}: ERROR - ${r.error}`)
      continue
    }

    console.log(
      `${r.name.padEnd(28)} [${r.chain.padEnd(10)}]  ${r.behind} blocks behind (indexed=${r.indexedBlock}, current=${r.currentBlock})`,
    )
  }
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})

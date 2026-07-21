/* Run: npx tsx apps/earn-exit/scripts/check-positions.ts 0xYourAddress */
import { type Address } from 'viem'

import { getAllPositions } from '../lib/positions'

const main = async () => {
  const user = process.argv[2] as Address

  if (!user?.startsWith('0x')) throw new Error('usage: check-positions.ts <address>')

  const { positions, failedChainIds } = await getAllPositions(user)

  for (const position of positions) {
    console.log(
      `[chain ${position.chainId}] ${position.displayName} (${position.fleetAddress})`,
      `wallet=${position.walletShares} staked=${position.stakedShares}`,
      `assets=${position.totalAssets} ${position.asset.symbol}`,
    )
  }
  if (failedChainIds.length) console.warn('failed chains:', failedChainIds)
  console.log(`${positions.length} position(s) found`)
}

void main()

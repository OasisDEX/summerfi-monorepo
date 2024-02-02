import hre from 'hardhat'
import { BlockNumber, CurrentBlock, Quantity } from '~deployment-utils'

export async function fastForwardChain(seconds: number): Promise<Quantity> {
  const testClient = await hre.viem.getTestClient()
  return testClient.increaseTime({ seconds })
}

export async function getCurrentBlock(): Promise<CurrentBlock> {
  const publicClient = await hre.viem.getPublicClient()
  return publicClient.getBlock()
}

export async function getCurrentTimestamp(): Promise<BlockNumber> {
  const publicClient = await hre.viem.getPublicClient()
  return publicClient.getBlockNumber()
}

export async function getNextTimestamp(): Promise<BlockNumber> {
  return (await getCurrentTimestamp()) + 1n
}

export async function getLastTimestamp(): Promise<BlockNumber> {
  return (await getCurrentTimestamp()) - 1n
}

export async function setNextBlockTimestamp(): Promise<void> {
  const testClient = await hre.viem.getTestClient()
  const nextTimestamp = await getNextTimestamp()

  return testClient.setNextBlockTimestamp({ timestamp: nextTimestamp })
}

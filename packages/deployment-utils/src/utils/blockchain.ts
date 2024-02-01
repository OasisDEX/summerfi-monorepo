import hre from 'hardhat'
import { GetBlockReturnType, Chain, Quantity, GetBlockNumberReturnType } from 'viem'

export async function fastForwardChain(seconds: number): Promise<Quantity> {
  const testClient = await hre.viem.getTestClient()
  return testClient.increaseTime({ seconds })
}

export async function getCurrentBlock(): Promise<GetBlockReturnType<Chain, false, 'latest'>> {
  const publicClient = await hre.viem.getPublicClient()
  return publicClient.getBlock()
}

export async function getCurrentTimestamp(): Promise<GetBlockNumberReturnType> {
  const publicClient = await hre.viem.getPublicClient()
  return publicClient.getBlockNumber()
}

export async function getNextTimestamp(): Promise<GetBlockNumberReturnType> {
  return (await getCurrentTimestamp()) + 1n
}

export async function getLastTimestamp(): Promise<GetBlockNumberReturnType> {
  return (await getCurrentTimestamp()) - 1n
}

export async function setNextBlockTimestamp(): Promise<void> {
  const testClient = await hre.viem.getTestClient()
  const nextTimestamp = await getNextTimestamp()

  return testClient.setNextBlockTimestamp({ timestamp: nextTimestamp })
}

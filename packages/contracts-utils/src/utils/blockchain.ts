import hre from 'hardhat'

export async function fastForwardChain(seconds: number) {
  const testClient = await hre.viem.getTestClient()
  return testClient.increaseTime({ seconds })
}

export async function getCurrentBlock() {
  const publicClient = await hre.viem.getPublicClient()
  return publicClient.getBlock()
}

export async function getCurrentTimestamp() {
  const publicClient = await hre.viem.getPublicClient()
  return publicClient.getBlockNumber()
}

export async function getNextTimestamp() {
  return (await getCurrentTimestamp()) + 1n
}

export async function getLastTimestamp() {
  return (await getCurrentTimestamp()) - 1n
}

export async function setNextBlockTimestamp() {
  const testClient = await hre.viem.getTestClient()
  const nextTimestamp = await getNextTimestamp()

  return testClient.setNextBlockTimestamp({ timestamp: nextTimestamp })
}

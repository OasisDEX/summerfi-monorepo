import { bytesToHex, stringToBytes } from 'viem'

export const getInstiSubgraphId = (institutionName: string) => {
  return bytesToHex(
    stringToBytes(institutionName, {
      size: 32,
    }),
  )
}

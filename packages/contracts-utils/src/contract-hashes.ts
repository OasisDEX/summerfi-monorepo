import hre from 'hardhat'
import { ContractInfo, ContractsHashMap } from './types'
import { keccak256 } from '@ethersproject/keccak256'

export async function getContractsHashes(
  params: {
    exclusions: string[]
  } = { exclusions: [] },
): Promise<ContractsHashMap> {
  const contractsQualifiedNames = await hre.artifacts.getAllFullyQualifiedNames()

  const filteredNames = contractsQualifiedNames.filter((contract) => {
    return !params.exclusions.some((v) => contract.includes(v))
  })

  return filteredNames.reduce((hashMap, fullQualifiedName) => {
    const artifact = hre.artifacts.readArtifactSync(fullQualifiedName)

    const name = fullQualifiedName.split(':')[1]

    const contractInfo: ContractInfo = {
      name: name,
      path: artifact.sourceName,
      hash: keccak256(artifact.bytecode),
    }

    return {
      ...hashMap,
      [name]: contractInfo,
    }
  }, {} as ContractsHashMap)
}

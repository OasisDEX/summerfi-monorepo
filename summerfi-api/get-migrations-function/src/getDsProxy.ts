import { Address } from '@summerfi/serverless-shared'
import { createAddressService } from './addressService'
import { Chain, HttpTransport, createPublicClient } from 'viem'
import { publicActionReverseMirage } from 'reverse-mirage'
import { dsProxyRegistryContract } from './abi/dsProxyRegistryContract'
import { dsProxyContract } from './abi/dsProxyContract'
import { Logger } from '@aws-lambda-powertools/logger'

export interface DsProxyResult {
  dsProxy?: Address
  eoa: Address
}

const ZERO_ADDRESS: Address = '0x0000000000000000000000000000000000000000'
export const getDsProxy = async (
  eoaOrProxy: Address,
  transport: HttpTransport,
  chain: Chain,
  logger?: Logger,
) => {
  const { getCoreContract } = createAddressService(chain.id)

  const publicClient = createPublicClient({
    chain,
    transport,
  }).extend(publicActionReverseMirage)

  const dsProxyRegistry = getCoreContract('DSProxyRegistry')

  if (dsProxyRegistry === undefined || dsProxyRegistry === ZERO_ADDRESS) {
    // we don't have the dsProxyRegistry for this chain
    return {
      eoa: eoaOrProxy,
    }
  }

  const possibleProxy = await publicClient
    .readContract({
      abi: dsProxyRegistryContract.abi,
      address: dsProxyRegistry,
      functionName: 'proxies',
      args: [eoaOrProxy],
    })
    .catch(() => {
      if (logger) {
        logger.warn('Error reading dsProxyRegistry', {
          eoaOrProxy,
          chaiId: chain.id,
          chainName: chain.name,
        })
      }
      return ZERO_ADDRESS
    })

  if (possibleProxy !== ZERO_ADDRESS) {
    return {
      dsProxy: possibleProxy,
      eoa: eoaOrProxy,
    }
  }

  // check if maybe it's a dsProxy
  const dsProxyOwner = await publicClient
    .readContract({
      abi: dsProxyContract.abi,
      address: eoaOrProxy,
      functionName: 'owner',
    })
    .catch(() => ZERO_ADDRESS)

  if (dsProxyOwner === ZERO_ADDRESS) {
    // there is no dsProxy for this eoa
    return {
      eoa: eoaOrProxy,
    }
  }

  // sanity check if the owner has the proxy in the registry
  const proxyFromOwner = await publicClient
    .readContract({
      abi: dsProxyRegistryContract.abi,
      address: dsProxyRegistry,
      functionName: 'proxies',
      args: [dsProxyOwner],
    })
    .catch(() => {
      if (logger) {
        logger.warn('Error reading dsProxyRegistry', {
          eoaOrProxy,
          chaiId: chain.id,
          chainName: chain.name,
        })
      }
      return ZERO_ADDRESS
    })

  if (proxyFromOwner === eoaOrProxy) {
    return {
      dsProxy: eoaOrProxy,
      eoa: dsProxyOwner,
    }
  }

  // we don't if the address is a dsProxy or not, so we return the eoa
  return {
    eoa: eoaOrProxy,
  }
}

import { TriggersQuery } from '@summerfi/automation-subgraph'
import BigNumber from 'bignumber.js'
import { PublicClient } from 'viem'

const mcdViewAbi = [
  {
    inputs: [
      { internalType: 'address', name: '_vat', type: 'address' },
      { internalType: 'address', name: '_manager', type: 'address' },
      { internalType: 'address', name: '_spotter', type: 'address' },
      { internalType: 'address', name: '_mom', type: 'address' },
      { internalType: 'address', name: '_owner', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      { internalType: 'address', name: '_allowedReader', type: 'address' },
      { internalType: 'bool', name: 'isApproved', type: 'bool' },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'ilk', type: 'bytes32' }],
    name: 'getNextPrice',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'ilk', type: 'bytes32' }],
    name: 'getPrice',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'vaultId', type: 'uint256' },
      { internalType: 'bool', name: 'useNextPrice', type: 'bool' },
    ],
    name: 'getRatio',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'vaultId', type: 'uint256' }],
    name: 'getVaultInfo',
    outputs: [
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'uint256', name: '', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'manager',
    outputs: [{ internalType: 'contract ManagerLike', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'osmMom',
    outputs: [{ internalType: 'contract OsmMomLike', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'spotter',
    outputs: [{ internalType: 'contract SpotterLike', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'vat',
    outputs: [{ internalType: 'contract VatLike', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'whitelisted',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const getMakerInfo = async ({
  trigger,
  publicClient,
}: {
  trigger: TriggersQuery['triggers'][0]
  publicClient: PublicClient
}) => {
  const mcdViewContract = '0xde21E8Bb2Aac2923C13d957745e96c37A223e2e6'
  const [vaultInfoResponse, assetPriceResponse] = await publicClient.multicall({
    contracts: [
      {
        abi: mcdViewAbi,
        address: mcdViewContract,
        functionName: 'getVaultInfo',
        args: [BigInt(trigger.cdp!.id)],
      },
      {
        abi: mcdViewAbi,
        address: mcdViewContract,
        functionName: 'getPrice',
        args: [trigger.cdp!.ilk as `0x${string}`],
      },
    ],
  })
  if (vaultInfoResponse.status !== 'success') {
    throw new Error("Couldn't get vault info")
  }
  if (assetPriceResponse.status !== 'success') {
    throw new Error("Couldn't get vault asset price")
  }
  const collateralDecimals = trigger.tokens.find((token) => token.symbol !== 'DAI')!.decimals
  const debtDecimals = trigger.tokens.find((token) => token.symbol === 'DAI')!.decimals
  const collateralPrice = new BigNumber(assetPriceResponse.result.toString()).dividedBy(
    new BigNumber(10).pow(Number(collateralDecimals)),
  )
  const [rawCollateralAmount, rawDebtAmount] = vaultInfoResponse.result
  const collateralAmount = new BigNumber(rawCollateralAmount.toString()).dividedBy(
    new BigNumber(10).pow(Number(collateralDecimals)),
  )
  const collateralInUSD = collateralAmount.times(collateralPrice)
  const debtInUsd = new BigNumber(rawDebtAmount.toString()).dividedBy(
    // actually in DAI, but DAI is 1:1 with USD within maker
    new BigNumber(10).pow(Number(debtDecimals)),
  )
  return { collateralInUSD, collateralAmount, collateralPrice, debtInUsd }
}

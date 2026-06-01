import { type SupportedNetworkIds, type TransactionWithStatus } from '@summerfi/app-types'
import { type SdkClient } from '@summerfi/sdk-client-react'
import { Address, getChainInfoByChainId, type IToken, TokenAmount } from '@summerfi/sdk-common'
import type BigNumber from 'bignumber.js'

type BuildSwitchParams = {
  selectedSwitchVault: `${string}-${number}`
  vaultToken: IToken
  amount: BigNumber | undefined
  positionAmount?: BigNumber
  userWalletAddress: `0x${string}`
  sourceFleetAddress: string
  vaultChainId: SupportedNetworkIds
  slippage: number
  getVaultSwitchTx: SdkClient['getVaultSwitchTx']
}

/**
 * Builds the vault-switch transaction list. The switched amount defaults to the
 * full position when no explicit amount is entered.
 */
export const buildSwitchTransactions = async ({
  selectedSwitchVault,
  vaultToken,
  amount,
  positionAmount,
  userWalletAddress,
  sourceFleetAddress,
  vaultChainId,
  slippage,
  getVaultSwitchTx,
}: BuildSwitchParams): Promise<TransactionWithStatus[]> => {
  const [destinationFleetAddress] = selectedSwitchVault.split('-') // it is {vaultId}-{chainId}

  const transactionsList = await getVaultSwitchTx({
    walletAddress: Address.createFromEthereum({ value: userWalletAddress }),
    amount: TokenAmount.createFrom({
      token: vaultToken,
      amount: amount && amount.gt(0) ? amount.toString() : (positionAmount?.toString() ?? '0'),
    }),
    chainInfo: getChainInfoByChainId(vaultChainId),
    slippage,
    sourceFleetAddress,
    destinationFleetAddress,
  })

  // Map to TransactionWithStatus and set executed to false
  return transactionsList.map((tx) => ({ ...tx, executed: false }))
}

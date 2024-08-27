import { useMemo } from 'react'
import { ArmadaPoolId, ArmadaPositionId, ArmadaProtocol } from '@summerfi/armada-protocol-service'
import { makeSDK } from '@summerfi/sdk-client'
import { Address, TokenAmount, User, Wallet } from '@summerfi/sdk-common'

import { sdkApiUrl } from '@/constants/sdk'

export const useSDK = () => {
  const sdk = useMemo(() => makeSDK({ apiURL: sdkApiUrl }), [])

  const getUserClient = useMemo(
    () =>
      async ({ chainId, walletAddress }: { chainId: number; walletAddress: string }) => {
        const chain = await sdk.chains.getChainById({
          chainId,
        })

        if (!chain) {
          throw new Error('Chain not found')
        }
        const user = await sdk.users
          .getUser({
            chainInfo: chain.chainInfo,
            walletAddress: Address.createFromEthereum({ value: walletAddress }),
          })
          .catch((error) => {
            throw new Error(`Failed to get user: ${error.message}`)
          })

        return user
      },
    [sdk],
  )

  const getNewDepositTX = useMemo(
    () =>
      async ({
        chainId,
        fleetAddress,
        walletAddress,
        amount,
      }: {
        chainId: number
        fleetAddress: string
        walletAddress: string
        amount: string
      }) => {
        const chain = await sdk.chains.getChainById({
          chainId,
        })

        if (!chain) {
          throw new Error('Chain not found')
        }
        const { chainInfo } = chain

        const poolId = ArmadaPoolId.createFrom({
          chainInfo,
          fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
          protocol: ArmadaProtocol.createFrom({ chainInfo }),
        })

        const poolInfo = await sdk.armada.getPoolInfo({
          poolId,
        })

        const user = User.createFrom({
          chainInfo,
          wallet: Wallet.createFrom({
            address: Address.createFromEthereum({ value: walletAddress }),
          }),
        })

        const tokenAmount = TokenAmount.createFrom({
          amount,
          token: poolInfo.totalDeposits.token,
        })

        return sdk.armada.getNewDepositTX({
          poolId,
          user,
          amount: tokenAmount,
        })
      },
    [sdk],
  )

  const getWithdrawTX = useMemo(
    () =>
      async ({
        chainId,
        fleetAddress,
        walletAddress,
        amount,
      }: {
        chainId: number
        fleetAddress: string
        walletAddress: string
        amount: string
      }) => {
        const chain = await sdk.chains.getChainById({
          chainId,
        })

        if (!chain) {
          throw new Error('Chain not found')
        }
        const { chainInfo } = chain

        const poolId = ArmadaPoolId.createFrom({
          chainInfo,
          fleetAddress: Address.createFromEthereum({ value: fleetAddress }),
          protocol: ArmadaProtocol.createFrom({ chainInfo }),
        })

        const poolInfo = await sdk.armada.getPoolInfo({
          poolId,
        })

        const user = User.createFrom({
          chainInfo,
          wallet: Wallet.createFrom({
            address: Address.createFromEthereum({ value: walletAddress }),
          }),
        })

        const tokenAmount = TokenAmount.createFrom({
          amount,
          token: poolInfo.totalDeposits.token,
        })

        return sdk.armada.getWithdrawTX({
          poolId,
          positionId: ArmadaPositionId.createFrom({
            id: walletAddress,
            user,
          }),
          amount: tokenAmount,
        })
      },
    [sdk],
  )

  const getTokenBySymbol = useMemo(
    () =>
      async ({ chainId, symbol }: { chainId: number; symbol: string }) => {
        const chain = await sdk.chains.getChainById({
          chainId,
        })

        if (!chain) {
          throw new Error('Chain not found')
        }

        const token = await chain.tokens.getTokenBySymbol({ symbol }).catch((error) => {
          throw new Error(`Failed to get token: ${error.message}`)
        })

        if (!token) {
          throw new Error(`SDK: Unsupport token: ${symbol}`)
        }

        return token
      },
    [sdk],
  )

  return {
    getNewDepositTX,
    getWithdrawTX,
    getTokenBySymbol,
    getUserClient,
  }
}

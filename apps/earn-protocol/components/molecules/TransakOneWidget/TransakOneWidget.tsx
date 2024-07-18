import { useChain, useSmartAccountClient, useUser } from '@alchemy/aa-alchemy/react'
import { Button } from '@summerfi/app-ui'

import { accountType } from '@/providers/AlchemyAccountsProvider/config'
import { getTransakConfig } from '@/transak/config'

// Base network usdcFleet address
const usdcFleetAddress = '0xa09e82322f351154a155f9e0f9e6ddbc8791c794'

export const TransakOneWidget = () => {
  const { client } = useSmartAccountClient({
    type: accountType,
  })
  const { chain } = useChain()
  const user = useUser()

  if (!client) {
    return null
  }

  // to be configured based on form state
  const sourceTokenData = [
    {
      sourceTokenCode: 'USDC',
      sourceTokenAmount: 100, // amount user want to deposit to protocol
    },
  ]

  // to be replaced with actual call data for depositing into earn-protocol on behalf of the user
  const calldata = '0x0'

  const handleOpen = () => {
    const transak = getTransakConfig({
      config: {
        isTransakOne: true,
        walletAddress: client.account.address,
        network: chain.name.toLowerCase(),
        email: user?.email,
        exchangeScreenTitle: 'Deposit Funds',
        estimatedGasLimit: 70000,
        /**
         * Details of the token smart contract that is going to be used
         * in the transaction we are supplying USDC to summer-earn protocol
         * So we are sending USDC as sourceTokenData along with the amount
         * we want to deposit on users behalf
         */
        sourceTokenData,
        calldata,
        smartContractAddress: usdcFleetAddress,
      },
    })

    transak.init()
  }

  return (
    <Button variant="primarySmall" onClick={handleOpen} style={{ width: 'fit-content' }}>
      Transak-One
    </Button>
  )
}

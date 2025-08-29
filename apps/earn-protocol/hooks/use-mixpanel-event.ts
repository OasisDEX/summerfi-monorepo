import { useChain, useUser } from '@account-kit/react'
import { useUserWallet } from '@summerfi/app-earn-ui'
import { debounce } from 'lodash-es'
import { usePathname } from 'next/navigation'

import { EarnProtocolEvents } from '@/helpers/mixpanel'

export const useHandleTooltipOpenEvent = () => {
  const pathname = usePathname()
  const user = useUser()
  const { userWalletAddress: walletAddress, isLoadingAccount } = useUserWallet()
  const { chain } = useChain()

  const userData = !isLoadingAccount
    ? { walletAddress, connectionMethod: user?.type, network: chain.name }
    : {}

  return debounce((tooltipName: string) => {
    EarnProtocolEvents.tooltipHovered({
      page: pathname,
      tooltipName: `ep-${tooltipName}`,
      ...userData,
    })
  }, 1000)
}

export const useHandleButtonOpenEvent = () => {
  const pathname = usePathname()
  const user = useUser()
  const { userWalletAddress: walletAddress, isLoadingAccount } = useUserWallet()
  const { chain } = useChain()

  const userData = !isLoadingAccount
    ? { walletAddress, connectionMethod: user?.type, network: chain.name }
    : {}

  return debounce((buttonName: string) => {
    EarnProtocolEvents.buttonClicked({
      page: pathname,
      buttonName: `ep-${buttonName}`,
      ...userData,
    })
  }, 1000)
}

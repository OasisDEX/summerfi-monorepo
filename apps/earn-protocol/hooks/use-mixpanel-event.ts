import { useCallback, useMemo } from 'react'
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

export const useHandleInputChangeEvent = () => {
  const pathname = usePathname()
  const user = useUser()
  const { userWalletAddress: walletAddress, isLoadingAccount } = useUserWallet()
  const { chain } = useChain()

  const userData = useMemo(() => {
    return !isLoadingAccount
      ? { walletAddress, connectionMethod: user?.type, network: chain.name }
      : {}
  }, [chain.name, isLoadingAccount, user?.type, walletAddress])

  const handleEvent = useCallback(
    ({ inputName, value }: { inputName: string; value: string }) => {
      EarnProtocolEvents.inputChanged({
        page: pathname,
        inputName: `ep-${inputName}`,
        value,
        ...userData,
      })
    },
    [pathname, userData],
  )

  return useMemo(() => debounce(handleEvent, 1000), [handleEvent])
}

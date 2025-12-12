import { ADDRESS_ZERO, formatAddress } from '@summerfi/app-utils'

import { type TallyDelegate } from '@/app/server-handlers/raw-calls/tally'

/**
 * Gets the display title for a delegate, prioritizing displayName > customTitle > ens > formatted address
 * @param delegate - The delegate object (optional)
 * @param currentDelegate - Current delegate address
 * @returns Display title string
 */
export const getDelegateTitle = ({
  tallyDelegate,
  currentDelegate,
}: {
  tallyDelegate?: TallyDelegate
  currentDelegate: string
}) => {
  if (!tallyDelegate) {
    return currentDelegate === ADDRESS_ZERO ? 'No delegate' : formatAddress(currentDelegate)
  }

  const { displayName, customTitle, ens } = tallyDelegate

  if (displayName) {
    return displayName
  }

  if (customTitle) {
    return customTitle
  }

  if (ens) {
    return ens
  }

  return formatAddress(tallyDelegate.userAddress)
}

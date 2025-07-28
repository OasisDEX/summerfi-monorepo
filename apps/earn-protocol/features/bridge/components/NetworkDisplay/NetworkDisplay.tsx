import { Icon, networkNameIconNameMap, Text } from '@summerfi/app-earn-ui'
import { chainIdToSDKNetwork, sdkNetworkToHumanNetwork } from '@summerfi/app-utils'
import { capitalize } from 'lodash-es'

import styles from './NetworkDisplay.module.css'

interface NetworkDisplayProps {
  chainId: number
  amount?: string
}

export const NetworkDisplay: React.FC<NetworkDisplayProps> = ({ chainId, amount }) => {
  const network = chainIdToSDKNetwork(chainId)
  const networkName = sdkNetworkToHumanNetwork(network)
  const networkIcon = networkNameIconNameMap[network]

  return (
    <div className={styles.networkDisplay}>
      <div className={styles.iconWrapper}>
        <Icon iconName="sumr" size={16} className={styles.sumrIcon} />
        {networkIcon && <Icon size={44} iconName={networkIcon} />}
      </div>
      {amount && (
        <div className={styles.details}>
          <Text variant="p4semi" as="p" className={styles.amount}>
            {amount} SUMR
          </Text>
          <Text variant="p2semi">On {capitalize(networkName)}</Text>
        </div>
      )}
    </div>
  )
}

import { Card, Icon, type IconNamesList, Text } from '@summerfi/app-earn-ui'

import cryptoUtilitiesStyles from '@/components/layout/LandingPageContent/content/CryptoUtilities.module.css'

const CryptoUtilityCard = ({ iconName, label }: { iconName: IconNamesList; label: string }) => {
  return (
    <Card className={cryptoUtilitiesStyles.cryptoUtilityCard}>
      <Icon iconName={iconName} size={54} />
      <Text variant="p2semi">{label}</Text>
    </Card>
  )
}

export const CryptoUtilities = () => {
  return (
    <div>
      <div className={cryptoUtilitiesStyles.cryptoUtilitiesHeaderWrapper}>
        <Text variant="p2semiColorful" as="p">
          Crypto Utilities
        </Text>
        <Text variant="h2" className={cryptoUtilitiesStyles.cryptoUtilitiesHeader}>
          Send, swap, bridge, buy and cash out,
          <br className={cryptoUtilitiesStyles.lineBreak} /> all in one app.
        </Text>
      </div>
      <div className={cryptoUtilitiesStyles.cryptoUtilitiesBlockWrapper}>
        <CryptoUtilityCard label="Send" iconName="landing_page_send" />
        <CryptoUtilityCard label="Swap" iconName="landing_page_swap" />
        <CryptoUtilityCard label="Bridge" iconName="landing_page_bridge" />
        <CryptoUtilityCard label="Buy" iconName="landing_page_buy" />
        <CryptoUtilityCard label="Cash out" iconName="landing_page_cashout" />
      </div>
    </div>
  )
}

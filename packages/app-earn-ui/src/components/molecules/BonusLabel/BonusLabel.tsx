import { Icon } from '@/components/atoms/Icon/Icon'
import { Pill } from '@/components/atoms/Pill/Pill'
import { Text } from '@/components/atoms/Text/Text'

export const BonusLabel = ({
  tokenBonus,
  apy,
  rays,
}: {
  tokenBonus?: string
  apy?: string
  rays?: string
}) => (
  <Text style={{ color: 'var(--earn-protocol-secondary-100)' }}>
    {!!tokenBonus || !!apy || !!rays ? (
      <Pill>
        {tokenBonus ?? rays ? <Icon iconName="stars" size={24} color="white" /> : null}
        {apy ? `APY ${apy}%` : ''}
        {tokenBonus && apy ? <>&nbsp;+&nbsp;</> : ''}
        {tokenBonus ? `${tokenBonus} SUMR` : ''}
        {rays ? `${rays} RAYS` : ''}
      </Pill>
    ) : null}
  </Text>
)

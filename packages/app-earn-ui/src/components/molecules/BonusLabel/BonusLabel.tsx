import { type ReactNode } from 'react'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Pill } from '@/components/atoms/Pill/Pill'
import { Text } from '@/components/atoms/Text/Text'

export const BonusLabel = ({
  tokenBonus,
  apy,
  rays,
  raw,
}: {
  tokenBonus?: string
  apy?: string
  rays?: string
  raw?: ReactNode
}) => (
  <Text style={{ color: 'var(--earn-protocol-secondary-100)' }}>
    {!!tokenBonus || !!apy || !!rays || !!raw ? (
      <Pill>
        {tokenBonus ?? rays ? <Icon iconName="stars" size={24} color="white" /> : null}
        {apy ? `APY ${apy}` : ''}
        {tokenBonus && apy ? <>&nbsp;+&nbsp;</> : ''}
        {tokenBonus ? `${tokenBonus} SUMR` : ''}
        {rays ? `${rays} RAYS` : ''}
        {raw ? raw : ''}
      </Pill>
    ) : null}
  </Text>
)

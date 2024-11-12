import { type ReactNode } from 'react'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Pill } from '@/components/atoms/Pill/Pill'
import { Text } from '@/components/atoms/Text/Text'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'

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
  <Tooltip
    tooltip={
      <Text as="p" variant="p4semi">
        Tortor mauris id neque viverra. Felis id scelerisque nulla pharetra ultrices enim vehicula
        ut. Diam curabitur fusce eleifend eu.
      </Text>
    }
    tooltipWrapperStyles={{ minWidth: '240px', top: '30px', right: '-124px' }}
    tooltipCardVariant="cardSecondarySmallPaddings"
  >
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
  </Tooltip>
)

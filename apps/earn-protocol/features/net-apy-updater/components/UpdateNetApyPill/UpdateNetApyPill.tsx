import { type FC, useCallback } from 'react'
import { Button, Icon, Input, Text, ToggleButton, Tooltip } from '@summerfi/app-earn-ui'

import classNames from './UpdateNetApyPill.module.scss'

interface UpdateNetApyContentProps {
  toggleValue: boolean
  handleToggle: (flag: boolean) => void
  handleTooltipOpen: (flag: boolean) => void
}

const UpdateNetApyContent: FC<UpdateNetApyContentProps> = ({
  toggleValue,
  handleToggle,
  handleTooltipOpen,
}) => {
  return (
    <div className={classNames.updateNetApyContent}>
      <Text as="p" variant="p3semi" style={{ marginBottom: 'var(--general-space-8)' }}>
        Update Net APY
      </Text>
      <Text
        as="p"
        variant="p3"
        style={{
          marginBottom: 'var(--general-space-24)',
          color: 'var(--earn-protocol-secondary-60)',
        }}
      >
        Net APY is affected by rate and SUMR rewards. You can choose either include both or only one
        of those in APY.
      </Text>
      <Input placeholder="Enter fully diluted valuation" variant="dark" />
      <div className={classNames.toggleWrapper}>
        <ToggleButton
          title="Include SUMR"
          checked={toggleValue}
          onChange={(ev) => {
            handleToggle(ev.target.checked)
          }}
          titleVariant="p3semi"
          wrapperStyle={{ width: '100%', justifyContent: 'space-between' }}
          trackVariant="dark"
        />
      </div>
      <Button
        variant="primarySmall"
        onClick={() => {
          handleTooltipOpen(false)
        }}
      >
        Save changes
      </Button>
    </div>
  )
}

interface UpdateNetApyPillProps {
  toggleValue: boolean
  handleToggle: (flag: boolean) => void
}

export const UpdateNetApyPill: FC<UpdateNetApyPillProps> = ({ toggleValue, handleToggle }) => {
  const tooltip = useCallback(
    (_: boolean, handleTooltipOpen: (flag: boolean) => void) => (
      <UpdateNetApyContent
        toggleValue={toggleValue}
        handleToggle={handleToggle}
        handleTooltipOpen={handleTooltipOpen}
      />
    ),
    [toggleValue, handleToggle],
  )

  return (
    <Tooltip
      tooltip={tooltip}
      triggerOnClick
      persistWhenOpened
      tooltipCardVariant="cardPrimarySmallPaddings"
      tooltipWrapperStyles={{ top: '24px', right: '-103px' }}
    >
      {(isOpen) => (
        <div className={classNames.updateNetApyPillWrapper}>
          <Button active={isOpen} variant="secondarySmall" className={classNames.pill}>
            <Icon
              iconName="cog"
              size={20}
              color={
                isOpen ? 'var(--earn-protocol-secondary-100)' : 'var(--earn-protocol-secondary-40)'
              }
            />{' '}
            Net APY
          </Button>
        </div>
      )}
    </Tooltip>
  )
}

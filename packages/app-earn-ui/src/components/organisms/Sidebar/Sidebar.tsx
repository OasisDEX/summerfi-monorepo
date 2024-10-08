import { type ChangeEventHandler, type FC, type ReactNode } from 'react'
import { type DropdownOption } from '@summerfi/app-types'

import { Button } from '@/components/atoms/Button/Button'
import { Card } from '@/components/atoms/Card/Card'
import { Text } from '@/components/atoms/Text/Text'
import { InputWithDropdown } from '@/components/molecules/InputWithDropdown/InputWithDropdown'

import classNames from '@/components/organisms/Sidebar/Sidebar.module.scss'

interface SidebarProps {
  title: string
  inputValue: string
  handleInputChange: ChangeEventHandler<HTMLInputElement>
  dropdown: {
    options: DropdownOption[]
    value: DropdownOption
  }
  banner?: {
    title: string
    value: string
  }
  primaryButton: {
    label: string
    action: () => void
    disabled: boolean
  }
  footnote?: ReactNode
}

export const Sidebar: FC<SidebarProps> = ({
  title,
  inputValue,
  handleInputChange,
  dropdown,
  banner,
  primaryButton,
  footnote,
}) => {
  return (
    <Card className={classNames.sidebarWrapper} variant="cardPrimary">
      <div className={classNames.sidebarHeaderWrapper}>
        <Text as="h5" variant="h5" style={{ color: 'var(--earn-protocol-secondary-100)' }}>
          {title}
        </Text>
      </div>

      <div className={classNames.sidebarHeaderSpacer} />
      <InputWithDropdown
        value={inputValue}
        handleChange={handleInputChange}
        options={dropdown.options}
        dropdownValue={dropdown.value}
      />
      {banner && (
        <Card className={classNames.sidebarBannerWrapper} variant="cardSecondary">
          <Text as="p" variant="p3semi" style={{ color: 'var(--earn-protocol-secondary-40)' }}>
            {banner.title}
          </Text>
          <Text as="p" variant="p1semiColorful">
            {banner.value}
          </Text>
        </Card>
      )}
      <Button
        variant="primaryLarge"
        style={{ marginBottom: 'var(--general-space-20)', width: '100%' }}
        onClick={primaryButton.action}
      >
        {primaryButton.label}
      </Button>
      {footnote && <div className={classNames.sidebarFootnoteWrapper}>{footnote}</div>}
    </Card>
  )
}

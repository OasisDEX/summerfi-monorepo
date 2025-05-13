'use client'
import { type CSSProperties, useEffect, useMemo, useRef, useState } from 'react'
import { type TokenSymbolsList } from '@summerfi/app-types'
import { toggleArrayItem } from '@summerfi/app-utils'
import { isEqual } from 'lodash-es'
import Image from 'next/image'

import { Button } from '@/components/atoms/Button/Button'
import { Icon, type IconNamesList } from '@/components/atoms/Icon/Icon'
import { Input } from '@/components/atoms/Input/Input'
import { Text } from '@/components/atoms/Text/Text'
import {
  MobileDrawer,
  MobileDrawerDefaultWrapper,
} from '@/components/molecules/MobileDrawer/MobileDrawer'
import { TokensGroup } from '@/components/molecules/TokensGroup/TokensGroup'
import { useMobileCheck } from '@/hooks/use-mobile-check'
import { useOutsideElementClickHandler } from '@/hooks/use-outside-element-click-handler'

import classNames from './GenericMultiselect.module.css'

export interface GenericMultiselectOption {
  icon?: IconNamesList
  networkIcon?: IconNamesList
  image?: string
  label: string
  token?: TokenSymbolsList
  value: string
}

interface GenericMultiselectProps {
  fitContents?: boolean
  icon?: IconNamesList
  initialValues?: string[]
  label: string
  onChange: (value: string[]) => void
  onSingleChange?: (value: string) => void
  options: GenericMultiselectOption[]
  optionGroups?: {
    id: string
    key: string
    options: string[]
    icon?: IconNamesList
    buttonStyle?: CSSProperties
    iconStyle?: CSSProperties
  }[]
  style?: CSSProperties
  withSearch?: boolean
}

function GenericMultiselectIcon({
  icon,
  networkIcon,
  label,
  image,
  token,
  isSelectContainer,
}: {
  icon?: IconNamesList
  networkIcon?: IconNamesList
  image?: string
  label: string
  token?: TokenSymbolsList
  isSelectContainer?: boolean
}) {
  return (
    <div
      style={{
        flexShrink: 0,
        marginTop: '-4px',
        marginBottom: '-4px',
        marginRight: 'var(--general-space-8)',
        ...(image && { p: '3px' }),
      }}
    >
      {token && networkIcon && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            width: 'fit-content',
            height: 'fit-content',
          }}
        >
          <div style={{ position: 'absolute', top: '-3px', left: '-1px', zIndex: 1 }}>
            <Icon iconName={networkIcon} size={12} />
          </div>
          <Icon tokenName={token} size={isSelectContainer ? 28 : 32} />
        </div>
      )}
      {token && !networkIcon && (
        <TokensGroup tokens={[token]} forceSize={isSelectContainer ? 28 : 32} />
      )}
      {icon && (
        <Icon
          size={isSelectContainer ? 28 : 32}
          iconName={icon}
          style={{ verticalAlign: 'bottom' }}
        />
      )}
      {image && (
        <Image
          src={image}
          alt={label}
          style={{ width: '26px', height: '26px', verticalAlign: 'bottom' }}
        />
      )}
    </div>
  )
}

function GenericMultiselectItem({
  hasCheckbox = true,
  icon,
  networkIcon,
  image,
  isClearing = false,
  isDisabled = false,
  isSelected = false,
  label,
  onClick,
  token,
  value,
  style,
}: {
  hasCheckbox?: boolean
  isClearing?: boolean
  isDisabled?: boolean
  isSelected?: boolean
  onClick: (value: string) => void
  style?: CSSProperties
} & GenericMultiselectOption) {
  const [isHover, setIsHover] = useState(false)

  return (
    <li
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className={`${classNames.listItem}`}
      style={{
        paddingBottom: isClearing ? '16px' : '12px',
        paddingTop: isClearing ? 0 : '12px',
        paddingLeft: hasCheckbox ? '46px' : 'var(--general-radius-4)',
        color: isDisabled ? 'var(--earn-protocol-neutral-60)' : 'var(--earn-protocol-secondary-40)',
        borderRadius: isClearing ? 'none' : 'var(--radius-small)',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        borderBottom: isClearing ? '1px solid var(--earn-protocol-neutral-70)' : 'none',
        ...(isHover && {
          backgroundColor:
            isDisabled || isClearing ? 'transparent' : 'var(--earn-protocol-neutral-85)',
          color: isDisabled
            ? 'var(--earn-protocol-neutral-60)'
            : 'var(--earn-protocol-secondary-60)',
        }),
        ...style,
      }}
      onClick={() => {
        if (!isDisabled) onClick(value)
      }}
    >
      {hasCheckbox && (
        <div
          className={classNames.checkboxWrapper}
          style={{
            borderColor: isSelected
              ? 'var(--earn-protocol-success-100)'
              : 'var(--earn-protocol-neutral-70)',
            backgroundColor: isSelected ? 'var(--earn-protocol-success-10)' : 'unset',
          }}
        >
          <Icon
            size={12}
            className={classNames.checkboxIcon}
            style={{
              opacity: isSelected ? 1 : 0,
            }}
            iconName="checkmark"
            color="var(--earn-protocol-success-100)"
          />
        </div>
      )}
      {isClearing && (
        <div
          className={classNames.clearButton}
          style={{
            cursor: isDisabled ? 'not-allowed' : 'pointer',
          }}
        >
          <Icon size={10} iconName="close" />
        </div>
      )}
      {(icon ?? image ?? token ?? networkIcon) && (
        <GenericMultiselectIcon
          label={label}
          icon={icon}
          image={image}
          token={token}
          networkIcon={networkIcon}
        />
      )}
      {label}
    </li>
  )
}

export function GenericMultiselect({
  fitContents = false,
  icon,
  initialValues = [],
  label,
  onChange,
  onSingleChange,
  optionGroups,
  options,
  style,
  withSearch,
}: GenericMultiselectProps): React.ReactNode {
  const didMountRef = useRef(false)
  const [values, setValues] = useState<string[]>(initialValues)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [search, setSearch] = useState<string>('')
  const outsideRef = useOutsideElementClickHandler(() => setIsOpen(false))
  const scrollRef = useRef<HTMLUListElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const { isMobile } = useMobileCheck()

  const matchingOptionsGroup = useMemo(() => {
    return optionGroups?.filter(({ options: _options }) => isEqual(_options, values))[0]?.id
  }, [optionGroups, values])

  const selectLabel = useMemo(() => {
    switch (values.length) {
      case 0:
        return (
          <>
            {icon && (
              <Icon iconName={icon} size={32} style={{ flexShrink: 0, marginRight: '12px' }} />
            )}
            All {label.toLowerCase()}
          </>
        )
      case 1:
        // eslint-disable-next-line no-case-declarations
        const [selected] = options.filter((item) => item.value === values[0])

        return (
          <>
            {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
            {selected && (selected.icon ?? selected.image ?? selected.token) && (
              <GenericMultiselectIcon
                icon={selected.icon}
                networkIcon={selected.networkIcon}
                image={selected.image}
                label={selected.label}
                token={selected.token}
                isSelectContainer
              />
            )}
            {selected.label}
          </>
        )
      default:
        return optionGroups && matchingOptionsGroup ? (
          <>All</>
        ) : (
          <>
            {icon && (
              <Icon iconName={icon} size={32} style={{ flexShrink: 0, marginRight: '12px' }} />
            )}
            Selected {label.toLowerCase()}: {values.length}
          </>
        )
    }
  }, [icon, label, matchingOptionsGroup, optionGroups, options, values])

  const filteredOptions = useMemo(
    () =>
      options.filter(({ label: _label }) =>
        search.length ? _label.toLowerCase().includes(search.toLowerCase()) : true,
      ),
    [options, search],
  )

  useEffect(() => {
    if (didMountRef.current) onChange(values)
    else didMountRef.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values])

  const optionsMapped = (
    <ul
      ref={scrollRef}
      className={classNames.list}
      style={{
        maxHeight: fitContents ? 'auto' : '342px',
      }}
    >
      <GenericMultiselectItem
        hasCheckbox={false}
        isClearing
        isDisabled={values.length === 0}
        label="Clear selection"
        onClick={() => {
          setValues([])
          setIsOpen(false)
        }}
        style={{
          fontSize: '14px',
          fontWeight: 600,
        }}
        value=""
      />
      {withSearch && (
        <li style={{ position: 'relative', color: 'neutral80' }}>
          <Icon
            iconName="search_icon"
            variant="s"
            style={{
              position: 'absolute',
              top: 'var(--general-space-4)',
              left: 'var(--general-space-4)',
              pointerEvents: 'none',
            }}
          />
          <Input
            ref={searchRef}
            type="text"
            autoComplete="off"
            placeholder={`Search ${label.toLowerCase()}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={classNames.searchInput}
          />
        </li>
      )}
      {optionGroups && optionGroups.length > 0 && (
        <li style={{ display: 'flex', flexDirection: 'column', gap: 'var(--general-space-4)' }}>
          {optionGroups.map(
            ({ id, key, options: _options, icon: optionGroupIcon, buttonStyle, iconStyle }) => (
              <Button
                key={id}
                variant="unstyled"
                style={{
                  display: 'flex',
                  alignContent: 'center',
                  flexShrink: 0,
                  padding: '0 var(--general-space-16)',
                  whiteSpace: 'nowrap',
                  ...(matchingOptionsGroup === id && {
                    '&, &:hover': {
                      color: 'neutral10',
                      backgroundColor: 'interactive100',
                      borderColor: 'interactive100',
                    },
                  }),
                  ...buttonStyle,
                }}
                onClick={() => {
                  if (matchingOptionsGroup === id) setValues([])
                  else {
                    setValues(_options)
                    onSingleChange?.(`Group: ${id}`)
                  }
                }}
              >
                {optionGroupIcon && (
                  <Icon
                    iconName={optionGroupIcon}
                    size={24}
                    style={{ ...iconStyle, marginRight: 'var(--general-space-8)' }}
                  />
                )}
                <Text as="span" variant="p3semi">
                  {key} ({_options.length})
                </Text>
              </Button>
            ),
          )}
        </li>
      )}
      {filteredOptions.map((option) => (
        <GenericMultiselectItem
          key={option.value}
          isSelected={values.includes(option.value)}
          onClick={(value) => {
            setValues(toggleArrayItem<string>(values, value))
            onSingleChange?.(value)
          }}
          {...option}
        />
      ))}
      {filteredOptions.length === 0 && (
        <li>
          <Text as="p" variant="p3" style={{ margin: 'var(--general-space-4)' }}>
            No items matching your search were found
          </Text>
        </li>
      )}
    </ul>
  )

  return (
    <div
      style={{ position: 'relative', userSelect: 'none', width: 'fit-content', ...style }}
      ref={outsideRef}
    >
      <div
        className={classNames.mainWrapper}
        style={{
          ...(isOpen && {
            borderColor: 'var(--earn-protocol-neutral-60)',
          }),
        }}
        onClick={() => {
          setIsOpen((_isOpen) => {
            if (!isOpen && searchRef.current) {
              setSearch('')
              searchRef.current.focus()
            }

            return !_isOpen
          })
        }}
      >
        <Text
          as="div"
          variant="p3semi"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%',
            gap: 'var(--general-space-16)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>{selectLabel}</div>
          <Icon
            iconName={isOpen ? 'chevron_up' : 'chevron_down'}
            size={12}
            color={
              isOpen ? 'var(--earn-protocol-secondary-100)' : 'var(--earn-protocol-secondary-40)'
            }
          />
        </Text>
      </div>
      {isMobile ? (
        <MobileDrawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          slideFrom="bottom"
          height="auto"
          variant="default"
          zIndex={1001}
          style={{ backgroundColor: 'unset' }}
        >
          <MobileDrawerDefaultWrapper>{optionsMapped}</MobileDrawerDefaultWrapper>
        </MobileDrawer>
      ) : (
        <div
          className={classNames.optionsWrapper}
          style={{
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? 'translateY(0)' : 'translateY(-5px)',
            pointerEvents: isOpen ? 'auto' : 'none',
          }}
        >
          {optionsMapped}
        </div>
      )}
    </div>
  )
}

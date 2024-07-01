import { Fragment, useEffect } from 'react'

import { Button } from '@/components/atoms/Button/Button'
import { NavigationMenuPanelType } from '@/components/layout/Navigation/Navigation.types'
import { NavigationMenuDropdownContentList } from '@/components/layout/Navigation/NavigationMenuDropdownContentList'
import { ExpandableArrow } from '@/components/molecules/ExpandableArrow/ExpandableArrow'
import { useToggle } from '@/helpers/use-toggle'

import navigationMenuMobileStyles from './NavigationMenuMobile.module.scss'

type NavigationMobileMenuPanelProps = NavigationMenuPanelType & {
  isOpen: boolean
  openNestedMenu?: [string, number, number]
  onOpenNestedMenu: (openNestedMenu: [string, number, number]) => void
}

export function NavigationMobileMenuPanel({
  isOpen,
  label,
  lists,
  onOpenNestedMenu,
  openNestedMenu,
}: NavigationMobileMenuPanelProps) {
  const [isAccordionOpen, toggleIsAccordionOpen, setIsAccordionOpen] = useToggle(false)

  useEffect(() => {
    if (!isOpen) setIsAccordionOpen(false)
  }, [isOpen, setIsAccordionOpen])

  return (
    <>
      {openNestedMenu ? (
        <>
          {lists
            .filter(({ items }) => items.filter(({ list }) => list !== undefined))
            .map(({ items }, i) => (
              <Fragment key={i}>
                {items.map(({ list }, j) => (
                  <Fragment key={`${i}-${j}`}>
                    {list &&
                      openNestedMenu[0] === label &&
                      openNestedMenu[1] === i &&
                      openNestedMenu[2] === j && (
                        <li
                          style={{
                            rowGap: 3,
                            flexDirection: 'column',
                          }}
                        >
                          <NavigationMenuDropdownContentList {...list} />
                        </li>
                      )}
                  </Fragment>
                ))}
              </Fragment>
            ))}
        </>
      ) : (
        <li key={`link-${label}`}>
          <Button
            variant="secondarySmall"
            className={navigationMenuMobileStyles.navigationMenuMobileLink}
            onClick={() => {
              toggleIsAccordionOpen()
            }}
          >
            {label}{' '}
            <ExpandableArrow
              direction={isAccordionOpen ? 'up' : 'down'}
              size={13}
              color="primary60"
            />
          </Button>
          {isAccordionOpen && (
            <ul
              style={{
                paddingTop: 3,
                paddingLeft: 0,
                listStyle: 'none',
              }}
            >
              {lists.map((item, i) => (
                <li
                  key={i}
                  style={{
                    rowGap: 3,
                    flexDirection: 'column',
                  }}
                >
                  <NavigationMenuDropdownContentList
                    parentIndex={i}
                    onClick={(selected) => onOpenNestedMenu([label, ...selected])}
                    {...item}
                  />
                </li>
              ))}
            </ul>
          )}
        </li>
      )}
    </>
  )
}

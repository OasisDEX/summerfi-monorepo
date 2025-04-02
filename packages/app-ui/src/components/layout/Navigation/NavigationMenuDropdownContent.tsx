import { Fragment, useEffect, useRef, useState } from 'react'
import { type NavigationMenuPanelType, type WithNavigationModules } from '@summerfi/app-types'
import clsx from 'clsx'

import { NavigationMenuDropdownContentList } from '@/components/layout/Navigation/NavigationMenuDropdownContentList'

import navigationMenuDropdownContentStyles from './NavigationMenuDropdownContent.module.scss'

export type NavigationMenuDropdownContentProps = NavigationMenuPanelType &
  WithNavigationModules & {
    currentPanel: string
    isPanelActive: boolean
    isPanelOpen: boolean
    onChange: (height: number) => void
    onSelect: () => void
  }

export const NavigationMenuDropdownContent = ({
  currentPanel,
  isPanelActive,
  isPanelOpen,
  label,
  lists,
  onChange,
  onSelect,
  navigationModules,
}: NavigationMenuDropdownContentProps): React.ReactNode => {
  const ref = useRef<HTMLLIElement>(null)
  const [selected, setSelected] = useState<[number, number]>([0, 0])

  useEffect(() => {
    setSelected([0, 0])
  }, [currentPanel, isPanelOpen])

  useEffect(() => {
    if (currentPanel === label && ref.current) {
      const root = document.documentElement

      // updates the height of the dropdown content
      // by changing the CSS variable
      root.style.setProperty(
        '--navigation-dropdown-content-dynamic-height',
        `${ref.current.offsetHeight}px`,
      )
      onChange(ref.current.offsetHeight)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPanel, selected])

  return (
    <>
      <ul className={navigationMenuDropdownContentStyles.navigationMenuDropdownContentFirstColumn}>
        {lists.map((item, i) => (
          <li
            key={i}
            className={
              navigationMenuDropdownContentStyles.navigationMenuDropdownContentFirstColumnLi
            }
            style={{
              pointerEvents: isPanelActive ? 'auto' : 'none',
            }}
          >
            <NavigationMenuDropdownContentList
              {...item}
              parentIndex={i}
              selected={selected}
              navigationModules={navigationModules}
              onSelect={(_selected) => {
                setSelected(_selected)
                onSelect()
              }}
            />
          </li>
        ))}
      </ul>
      <ul className={navigationMenuDropdownContentStyles.navigationMenuDropdownContentSecondColumn}>
        {lists
          .filter(({ items }) => items.filter(({ list }) => list !== undefined))
          .map(({ items }, i) => (
            <Fragment key={i}>
              {items.map(({ list }, j) => (
                <Fragment key={j}>
                  {list && (
                    <li
                      key={`${i}-${j}`}
                      className={clsx(
                        navigationMenuDropdownContentStyles.navigationMenuDropdownContentSecondColumnLi,
                        {
                          [navigationMenuDropdownContentStyles.navigationMenuDropdownContentSecondColumnLiActive]:
                            selected[0] === i && selected[1] === j,
                        },
                      )}
                      style={{
                        // not worth it to extract this to a variable
                        transform: `translateY(${
                          (selected[0] === i && selected[1] < j) || selected[0] < i
                            ? 50
                            : (selected[0] === i && selected[1] > j) || selected[0] > i
                              ? -50
                              : 0
                        }px)`,
                        pointerEvents:
                          isPanelActive && selected[0] === i && selected[1] === j ? 'auto' : 'none',
                      }}
                      {...(selected[0] === i && selected[1] === j && { ref })}
                    >
                      <NavigationMenuDropdownContentList
                        navigationModules={navigationModules}
                        {...list}
                      />
                    </li>
                  )}
                </Fragment>
              ))}
            </Fragment>
          ))}
      </ul>
    </>
  )
}

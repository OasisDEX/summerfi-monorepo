/* eslint-disable no-magic-numbers */
import { useEffect, useRef, useState } from 'react'

import { NavigationMenuPanelType } from '@/components/layout/Navigation/Navigation.types'

import navigationMenuDropdownContentStyles from './NavigationMenuDropdownContent.module.scss'

export type NavigationMenuDropdownContentProps = NavigationMenuPanelType & {
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
}: NavigationMenuDropdownContentProps) => {
  const ref = useRef<HTMLDivElement>(null)
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
          >
            <NavigationMenuDropdownContentList
              {...item}
              parentIndex={i}
              selected={selected}
              onSelect={(_selected) => {
                setSelected(_selected)
                onSelect()
              }}
            />
          </li>
        ))}
      </ul>
      <div>asd</div>
    </>
  )
}

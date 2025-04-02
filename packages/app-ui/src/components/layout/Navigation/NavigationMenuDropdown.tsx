import { useEffect, useRef, useState } from 'react'
import { type NavigationMenuPanelType, type WithNavigationModules } from '@summerfi/app-types'
import clsx from 'clsx'

import { NavigationMenuDropdownContent } from '@/components/layout/Navigation/NavigationMenuDropdownContent'

import navigationMenuDropdownStyles from './NavigationMenuDropdown.module.scss'

export interface NavigationMenuDropdownProps extends WithNavigationModules {
  arrowPosition: number
  currentPanel: string
  isPanelOpen: boolean
  isPanelSwitched: boolean
  panels: NavigationMenuPanelType[]
}

interface NavigationMenuPointerProps {
  arrowPosition: number
  isPanelOpen: boolean
  isPanelSwitched: boolean
}

function getDropdownTranslation(
  labelsMap: string[],
  activePanel: string,
  currentPanel: string,
): string {
  if (activePanel === currentPanel) return '0'
  else if (labelsMap.indexOf(currentPanel) > labelsMap.indexOf(activePanel)) return '-20%'
  else return '20%'
}

function NavigationMenuPointer({
  arrowPosition,
  isPanelOpen,
  isPanelSwitched,
}: NavigationMenuPointerProps) {
  return (
    <div
      className={clsx(navigationMenuDropdownStyles.navigationMenuPointer, {
        [navigationMenuDropdownStyles.navigationMenuPointerActive]: isPanelOpen,
      })}
    >
      <div
        className={clsx(navigationMenuDropdownStyles.arrow, {
          [navigationMenuDropdownStyles.arrowActive]: isPanelSwitched,
        })}
        style={{
          transform: `translateX(${arrowPosition}px) scaleX(1.3) rotate(45deg)`,
        }}
      />
    </div>
  )
}

export const NavigationMenuDropdown = ({
  arrowPosition,
  currentPanel,
  isPanelOpen,
  isPanelSwitched,
  panels,
  navigationModules,
}: NavigationMenuDropdownProps): React.ReactNode => {
  const ref = useRef<HTMLDivElement>(null)
  const [isListSwitched, setIsListSwitched] = useState<boolean>(false)
  const [height, setHeight] = useState<number>(0)

  const labelsMap = panels.map((panel) => panel.label)

  useEffect(() => {
    if (!isPanelOpen) setIsListSwitched(false)
  }, [isPanelOpen])

  return (
    <div
      className={clsx(navigationMenuDropdownStyles.navigationMenu, {
        [navigationMenuDropdownStyles.navigationMenuActive]: isPanelOpen,
      })}
      style={{
        pointerEvents: isPanelOpen ? 'auto' : 'none',
      }}
    >
      <NavigationMenuPointer
        arrowPosition={arrowPosition}
        isPanelOpen={isPanelOpen}
        isPanelSwitched={isPanelSwitched}
      />
      <div className={clsx(navigationMenuDropdownStyles.navigationMenuDropdownWrapper)}>
        <div
          className={clsx(navigationMenuDropdownStyles.navigationMenuDropdownBlock, {
            [navigationMenuDropdownStyles.navigationMenuDropdownBlockActive]: isPanelOpen,
          })}
          style={{
            pointerEvents: isPanelOpen ? 'auto' : 'none',
          }}
        >
          <div
            className={clsx(navigationMenuDropdownStyles.navigationMenuDropdownBlockInside, {
              [navigationMenuDropdownStyles.navigationMenuDropdownBlockInsideActive]:
                isPanelSwitched || isListSwitched,
            })}
            style={{
              ...(height > 0 && { height }),
            }}
          >
            {panels.map(({ label, ...panel }, i) => (
              <div
                key={i}
                className={clsx(navigationMenuDropdownStyles.navigationMenuDropdownPanelWrapper, {
                  [navigationMenuDropdownStyles.navigationMenuDropdownPanelWrapperIsCurrentPanel]:
                    isPanelOpen && currentPanel === label,
                  [navigationMenuDropdownStyles.navigationMenuDropdownPanelWrapperIsPanelSwitched]:
                    isPanelSwitched,
                })}
                style={{
                  transform: `translateX(${getDropdownTranslation(
                    labelsMap,
                    label,
                    currentPanel,
                  )})`,
                  pointerEvents: isPanelOpen && currentPanel === label ? 'auto' : 'none',
                }}
                {...(currentPanel === label && { ref })}
              >
                <NavigationMenuDropdownContent
                  currentPanel={currentPanel}
                  isPanelActive={isPanelOpen && currentPanel === label}
                  isPanelOpen={isPanelOpen}
                  navigationModules={navigationModules}
                  label={label}
                  onChange={(_height) => {
                    if (ref.current) setHeight(Math.max(_height, ref.current.offsetHeight))
                  }}
                  onSelect={() => {
                    setIsListSwitched(true)
                  }}
                  {...panel}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

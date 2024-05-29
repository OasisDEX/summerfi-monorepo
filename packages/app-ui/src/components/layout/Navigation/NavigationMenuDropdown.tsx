/* eslint-disable no-magic-numbers */
import { useEffect, useRef, useState } from 'react'
import classNames from 'classNames'

import {
  NavigationMenuPanelType,
  WithNavigationModules,
} from '@/components/layout/Navigation/Navigation.types'
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
      className={classNames(navigationMenuDropdownStyles.navigationMenuPointer, {
        [navigationMenuDropdownStyles.navigationMenuPointerActive]: isPanelOpen,
      })}
    >
      <div
        className={classNames(navigationMenuDropdownStyles.arrow, {
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
}: NavigationMenuDropdownProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isListSwitched, setIsListSwitched] = useState<boolean>(false)
  const [height, setHeight] = useState<number>(0)

  const labelsMap = panels.map((panel) => panel.label)

  useEffect(() => {
    if (!isPanelOpen) setIsListSwitched(false)
  }, [isPanelOpen])

  return (
    <div
      className={classNames(navigationMenuDropdownStyles.navigationMenu, {
        [navigationMenuDropdownStyles.navigationMenuActive]: isPanelOpen,
      })}
    >
      <NavigationMenuPointer
        arrowPosition={arrowPosition}
        isPanelOpen={isPanelOpen}
        isPanelSwitched={isPanelSwitched}
      />
      <div className={navigationMenuDropdownStyles.navigationMenuDropdownWrapper}>
        <div
          className={classNames(navigationMenuDropdownStyles.navigationMenuDropdownBlock, {
            [navigationMenuDropdownStyles.navigationMenuDropdownBlockActive]: isPanelOpen,
          })}
        >
          <div
            className={classNames(navigationMenuDropdownStyles.navigationMenuDropdownBlockInside, {
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
                className={classNames(
                  navigationMenuDropdownStyles.navigationMenuDropdownPanelWrapper,
                  {
                    [navigationMenuDropdownStyles.navigationMenuDropdownPanelWrapperIsCurrentPanel]:
                      currentPanel === label,
                    [navigationMenuDropdownStyles.navigationMenuDropdownPanelWrapperIsCurrentPanelOpen]:
                      isPanelOpen && currentPanel === label,
                    [navigationMenuDropdownStyles.navigationMenuDropdownPanelWrapperIsPanelSwitched]:
                      isPanelSwitched,
                  },
                )}
                style={{
                  transform: `translateX(${getDropdownTranslation(
                    labelsMap,
                    label,
                    currentPanel,
                  )})`,
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

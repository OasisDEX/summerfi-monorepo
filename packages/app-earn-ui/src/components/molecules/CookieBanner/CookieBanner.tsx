'use client'
import { type FC, useState } from 'react'
import Link from 'next/link'

import { Button } from '@/components/atoms/Button/Button'
import { CheckboxButton } from '@/components/atoms/CheckboxButton/CheckboxButton'
import { Expander } from '@/components/atoms/Expander/Expander'
import { Text } from '@/components/atoms/Text/Text'
import { INTERNAL_LINKS } from '@/helpers/application-links'

import {
  ANALYTICS_COOKIE_NAMES,
  type AnalyticsCookieName,
  AnalyticsCookieNames,
  analyticsCookieVersion,
  type SavedAnalyticsCookiesSettings,
  type SelectedAnalyticsCookies,
} from './config'

import classNames from './CookieBanner.module.scss'

function initSelectedCookies(defaultValue: boolean): SelectedAnalyticsCookies {
  return ANALYTICS_COOKIE_NAMES.reduce(
    (acc, cookieName) => ({ ...acc, [cookieName]: defaultValue }),
    {
      [AnalyticsCookieNames.MARKETING]: defaultValue,
      [AnalyticsCookieNames.ANALYTICS]: defaultValue,
    },
  )
}

interface AnalyticsCookieBannerProps {
  value: SavedAnalyticsCookiesSettings | null
  setValue: (data: SavedAnalyticsCookiesSettings) => void
  manageCookie: { [key in AnalyticsCookieName]: { enable: () => void; disable: () => void } }
}

export const CookieBanner: FC<AnalyticsCookieBannerProps> = ({ value, setValue, manageCookie }) => {
  const [showSettings, setShowSettings] = useState(false)

  const [selectedCookies, setSelectedCookies] = useState(initSelectedCookies(false))
  const [settingsAreSaved, setSettingsAreSaved] = useState(false)

  // TO TEST LOCALLY REMOVE TURBOPACK CONDITION
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  if (settingsAreSaved || value?.version === analyticsCookieVersion || process.env.TURBOPACK) {
    return null
  }

  const toggleCookie = (cookieName: AnalyticsCookieName) => {
    const isEnabled = selectedCookies[cookieName]

    setSelectedCookies({
      ...selectedCookies,
      [cookieName]: !isEnabled,
    })
    if (isEnabled) {
      manageCookie[cookieName].disable()
    } else {
      manageCookie[cookieName].enable()
    }
  }

  const saveSettings = (settings: SavedAnalyticsCookiesSettings) => {
    setValue(settings)
    setSettingsAreSaved(true)
  }

  const rejectCookies = () => {
    ANALYTICS_COOKIE_NAMES.forEach((cookieName) => manageCookie[cookieName].disable())
    saveSettings({
      accepted: false,
      enabledCookies: initSelectedCookies(false),
      version: analyticsCookieVersion,
    })
  }

  const acceptSelectedCookies = () => {
    ANALYTICS_COOKIE_NAMES.forEach((cookieName) => {
      if (selectedCookies[cookieName]) {
        manageCookie[cookieName].enable()
      } else {
        manageCookie[cookieName].disable()
      }
    })
    saveSettings({
      accepted: true,
      enabledCookies: selectedCookies,
      version: analyticsCookieVersion,
    })
  }
  const acceptAllCookies = () => {
    ANALYTICS_COOKIE_NAMES.forEach((cookieName) => {
      manageCookie[cookieName].enable()
    })
    saveSettings({
      accepted: true,
      enabledCookies: initSelectedCookies(true),
      version: analyticsCookieVersion,
    })
  }

  return (
    <div className={classNames.cookieBannerWrapper}>
      <div className={classNames.cookieBannerContent}>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <Text as="p" variant="p4">
            We use the cookies on the website to improve your experience, analyze traffic, and for
            basic functionality. Cookies are anonymous and do not link to user data. You can still
            use the website without cookies. For more information, please read our{' '}
            <Link
              href={`${INTERNAL_LINKS.summerPro}/cookie`}
              style={{ color: 'var(--earn-protocol-primary-100)' }}
              target="_blank"
            >
              Cookie Policy
            </Link>
            .
          </Text>
          <Expander
            title={
              <Text as="p" variant="p4">
                Manage settings
              </Text>
            }
            iconVariant="xxs"
            expanderWrapperStyles={{
              marginTop: 'var(--general-space-4)',
            }}
            expanderButtonStyles={{
              padding: 'unset',
              justifyContent: 'flex-start',
            }}
            onExpand={(isExpanded) => setShowSettings(isExpanded)}
          >
            <div className={classNames.expanderContent}>
              <div className={classNames.expanderContentConfig}>
                <CheckboxButton
                  name={AnalyticsCookieNames.MARKETING}
                  checked={selectedCookies[AnalyticsCookieNames.MARKETING]}
                  onChange={() => toggleCookie(AnalyticsCookieNames.MARKETING)}
                  iconSize={12}
                />
                <div className={classNames.expanderContentTextual}>
                  <Text as="p" variant="p4">
                    Marketing Cookies
                  </Text>
                  <Text as="p" variant="p4">
                    Summer.fi uses anonymised cookies to be able to apply retargeting campaigns on
                    advertising platforms.
                  </Text>
                </div>
              </div>
              <div className={classNames.expanderContentConfig}>
                <CheckboxButton
                  name={AnalyticsCookieNames.ANALYTICS}
                  checked={selectedCookies[AnalyticsCookieNames.ANALYTICS]}
                  onChange={() => toggleCookie(AnalyticsCookieNames.ANALYTICS)}
                  iconSize={12}
                />
                <div className={classNames.expanderContentTextual}>
                  <Text as="p" variant="p4">
                    Analytics Cookies
                  </Text>
                  <Text as="p" variant="p4">
                    These items help us to understand how the website performs and find where it can
                    be improved.
                  </Text>
                </div>
              </div>
            </div>
          </Expander>
        </div>
        <div className={classNames.buttonsWrapper}>
          <Button variant="secondarySmall" onClick={rejectCookies}>
            Reject
          </Button>
          <Button
            variant="primarySmall"
            onClick={() => (showSettings ? acceptSelectedCookies() : acceptAllCookies())}
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  )
}

'use client'
import { merge } from 'lodash'

import { configLSKey, configLSOverridesKey } from '@/constants/config'
import { cleanObjectFromNull, cleanObjectToNull } from '@/helpers/clean-object'
import { AppConfigType, emptyConfig } from '@/types/generated'

type AppConfigTypeKey = keyof AppConfigType

/**
 * Updates config overrides in localStorage
 * @param config
 * @returns void
 */
export function updateConfigOverrides(config: AppConfigType): void {
  if (!window?.localStorage) return
  let overrideConfigRaw = localStorage.getItem(configLSOverridesKey)

  if (!overrideConfigRaw) {
    overrideConfigRaw = '{}'
  }
  try {
    const overrideConfig = JSON.parse(overrideConfigRaw)
    const newOverrideConfig = merge(cleanObjectToNull(config), overrideConfig)

    localStorage.setItem(configLSOverridesKey, JSON.stringify(newOverrideConfig))
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('updateConfigOverrides: Error parsing override config from localStorage', error)
  }
}

/**
 * Saves config to localStorage
 * @param config
 * @returns void
 */
export function saveConfigToLocalStorage(config: AppConfigType) {
  if (!window?.localStorage) return
  localStorage.setItem(configLSKey, JSON.stringify(config))
  updateConfigOverrides(config)
}

/**
 * Returns currently saved config from localStorage
 * PLEASE NOTE THAT THIS IS NOT DYNAMIC, IT WILL NOT UPDATE WHEN CONFIG CHANGES (only after a refresh)
 * @returns AppConfigType or empty config
 */
export function loadConfigFromLocalStorage() {
  if (typeof localStorage === 'undefined' || !localStorage || !window?.localStorage) {
    return emptyConfig
  }
  const configRaw = localStorage.getItem(configLSKey)

  if (!configRaw) {
    // eslint-disable-next-line no-console
    console.info('loadConfigFromLocalStorage: No config found in localStorage')

    return emptyConfig
  }
  try {
    const config = merge(
      JSON.parse(configRaw),
      cleanObjectFromNull(JSON.parse(localStorage.getItem(configLSOverridesKey) ?? '{}')),
    )

    return config as AppConfigType
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('loadConfigFromLocalStorage: Error parsing config from localStorage', error)

    return emptyConfig
  }
}

/**
 * Returns currently saved config from localStorage
 * PLEASE NOTE THAT THIS IS NOT DYNAMIC, IT WILL NOT UPDATE WHEN CONFIG CHANGES (only after a refresh)
 * @param configKey
 * @returns AppConfigType[T] or empty config
 */
export function getLocalAppConfig<T extends AppConfigTypeKey>(configKey: T): AppConfigType[T] {
  if (typeof localStorage === 'undefined' || !localStorage || !window?.localStorage) {
    return emptyConfig[configKey]
  }

  return loadConfigFromLocalStorage()[configKey]
}

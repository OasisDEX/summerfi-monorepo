'use client'
import { type AppConfigType, emptyConfig } from '@summerfi/app-types'
import { merge } from 'lodash-es'

import { cleanObjectFromNull, cleanObjectToNull } from './clean-object'

type AppConfigTypeKey = keyof AppConfigType

export const configLSKey = 'ob-config'
export const configLSOverridesKey = 'ob-config-overrides'

/**
 * Updates the configuration overrides stored in localStorage.
 *
 * This function merges the provided configuration object with any existing overrides
 * stored in localStorage. Before merging, it cleans the provided configuration by
 * replacing all its properties' values with `null`, making it easier to override specific
 * values. The result is then stored back in localStorage.
 *
 * @param config - The configuration object to be merged with existing overrides.
 * @returns void
 */
export const updateConfigOverrides = (config: AppConfigType): void => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
 * Saves the provided configuration to localStorage and updates the overrides.
 *
 * This function saves the given configuration object to localStorage under a specific key.
 * After saving, it also triggers an update to the configuration overrides, merging the
 * saved configuration with any existing overrides.
 *
 * @param config - The configuration object to be saved in localStorage.
 * @returns void
 */
export const saveConfigToLocalStorage = (config: AppConfigType): void => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!window?.localStorage) return
  localStorage.setItem(configLSKey, JSON.stringify(config))
  updateConfigOverrides(config)
}

/**
 * Returns currently saved config from localStorage
 * PLEASE NOTE THAT THIS IS NOT DYNAMIC, IT WILL NOT UPDATE WHEN CONFIG CHANGES (only after a refresh)
 * @returns AppConfigType or empty config
 */
export const loadConfigFromLocalStorage = (): AppConfigType => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
export const getLocalAppConfig = <T extends AppConfigTypeKey>(configKey: T): AppConfigType[T] => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (typeof localStorage === 'undefined' || !localStorage || !window?.localStorage) {
    return emptyConfig[configKey]
  }

  return loadConfigFromLocalStorage()[configKey]
}

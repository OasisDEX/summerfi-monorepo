const relativeTimeUnits = {
  year: 24 * 60 * 60 * 1000 * 365,
  month: (24 * 60 * 60 * 1000 * 365) / 12,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000,
}
const languagesMap = {
  cn: 'chi',
}

/**
 * Returns a formatted relative time string based on the difference between two dates.
 *
 * This function calculates the time difference between the `from` date (defaulting to the current date)
 * and the `to` date, then formats the result using `Intl.RelativeTimeFormat` based on the closest time unit.
 * Supported time units are year, month, day, hour, minute, and second. The function also supports different
 * languages and formatting styles.
 *
 * @param from - The starting date from which the time difference is calculated (defaults to the current date).
 * @param lang - The language code for formatting the relative time (default is 'en'). Custom mappings like 'cn' (Chinese) are supported.
 * @param numeric - Controls whether to always display numeric values or use words like "yesterday" (default is 'auto').
 * @param style - The formatting style for the relative time ('long', 'short', or 'narrow'). Default is 'long'.
 * @param to - The target date to which the relative time is calculated.
 * @returns A formatted string representing the time difference in the closest time unit.
 *
 * @example
 * // 1 day ago (in English)
 * timeAgo({ to: new Date(Date.now() - 24 * 60 * 60 * 1000) })
 *
 * @example
 * // 1 day ago (in Chinese)
 * timeAgo({ to: new Date(Date.now() - 24 * 60 * 60 * 1000), lang: 'cn' })
 */

export const timeAgo = ({
  from = new Date(),
  lang = 'en',
  numeric = 'auto',
  style = 'long',
  to,
}: {
  from?: Date
  lang?: string
  numeric?: Intl.RelativeTimeFormatNumeric
  style?: Intl.RelativeTimeFormatStyle
  to: Date
}): string => {
  const mappedLang = Object.keys(languagesMap).includes(lang)
    ? languagesMap[lang as keyof typeof languagesMap]
    : lang
  const elapsed = to.getTime() - from.getTime()
  const closestUnit = Object.keys(relativeTimeUnits).filter((unit) => {
    return Math.abs(elapsed) > relativeTimeUnits[unit as keyof typeof relativeTimeUnits]
  }) as (keyof typeof relativeTimeUnits)[]

  return new Intl.RelativeTimeFormat(mappedLang, { numeric, style }).format(
    Math.round(elapsed / relativeTimeUnits[closestUnit[0]]),
    closestUnit[0],
  )
}

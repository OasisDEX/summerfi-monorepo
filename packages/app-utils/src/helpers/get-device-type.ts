import { type DeviceInfo, DeviceType } from '@summerfi/app-types'

/**
 * Detects the type of device based on the user agent string.
 *
 * @param userAgent - The user agent string, typically from `navigator.userAgent` on the client side or `req.headers['user-agent']` on the server side.
 * @returns An object containing:
 * - `deviceType`: The type of device detected, which can be one of `DeviceType.MOBILE`, `DeviceType.TABLET`, or `DeviceType.DESKTOP`.
 *
 * @example
 * const deviceInfo = getDeviceType(navigator.userAgent);
 * console.log(deviceInfo.deviceType); // "MOBILE", "TABLET", or "DESKTOP"
 *
 * @remarks
 * - The function determines the device type by matching known mobile and tablet keywords in the user agent string.
 * - The user agent is converted to lowercase to ensure case-insensitive matching.
 */

export const getDeviceType = (userAgent: string): DeviceInfo => {
  const ua = userAgent.toLowerCase()
  const isMobile = /android|iphone|ipod|blackberry|windows phone/u.test(ua)
  const isTablet = /ipad|android(?!.*mobile)|tablet/u.test(ua)

  let deviceType: DeviceType

  if (isMobile) deviceType = DeviceType.MOBILE
  else if (isTablet) deviceType = DeviceType.TABLET
  else deviceType = DeviceType.DESKTOP

  return { deviceType }
}

export enum DeviceType {
  MOBILE = 'MOBILE',
  TABLET = 'TABLET',
  DESKTOP = 'DESKTOP',
}

export interface DeviceInfo {
  deviceType: DeviceType
}

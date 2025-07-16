export enum MerchandiseType {
  T_SHIRT = 't-shirt',
  HOODIE = 'hoodie',
}

export type MerchandiseFormValues = {
  name: string
  email: string
  address: string
  country: string
  zip: string
  size: string
}

export enum MerchandiseFormStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

export type MerchandiseFormErrors = {
  name?: string[]
  address?: string[]
  size?: string[]
  email?: string[]
  country?: string[]
  zip?: string[]
  global?: string[]
}

export enum MerchandiseSizes {
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
}

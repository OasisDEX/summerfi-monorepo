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

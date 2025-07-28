import z from 'zod'

import { MerchandiseSizes } from '@/features/merchandise/types'

export const merchandiseFormValuesSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .nonempty('Name is required'),
  email: z.string().nonempty('Email is required').email('Please enter a valid email address'),
  address: z
    .string()
    .min(2, 'Address must be at least 2 characters')
    .max(100, 'Address must be less than 100 characters')
    .nonempty('Address is required'),
  country: z
    .string()
    .min(2, 'Country must be at least 2 characters')
    .max(100, 'Country must be less than 100 characters')
    .nonempty('Country is required'),
  zip: z
    .string()
    .min(3, 'Zip code must be at least 3 characters')
    .max(12, 'Zip code must be at most 12 characters')
    .nonempty('Zip code is required'),
  size: z.nativeEnum(MerchandiseSizes),
})

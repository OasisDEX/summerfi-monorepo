import { type MerchandiseFormValues } from '@/features/merchandise/types'

/**
 * Checks if all required merchandise form fields are filled
 * @param formValues - The merchandise form values object
 * @returns True if all required fields (name, email, address, country, zip, size) are filled, false otherwise
 */
export const areAllMerchandiseFormFieldsFilled = (formValues: MerchandiseFormValues) => {
  const { name, email, address, country, zip, size } = formValues

  if (!name || !email || !address || !country || !zip || !size) {
    return false
  }

  return true
}

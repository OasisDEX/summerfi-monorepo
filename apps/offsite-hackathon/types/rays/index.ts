import { RaysApiResponse } from '@/server-handlers/rays'

export type RaysResponse = {
  rays?: RaysApiResponse
  error?: string
}

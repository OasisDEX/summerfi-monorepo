'use client'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { sdkApiUrl } from '@/constants/sdk'

import { Form, type FormProps } from './Form'

export default function FormContainer({ ...props }: FormProps) {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <Form {...props} />
    </SDKContextProvider>
  )
}

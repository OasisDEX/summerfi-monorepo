export type DefaultErrorResponse = {
  errorCode?: number
  message: string
}

export type DefaultOkResponse<T> = {
  errorCode?: number
  message: string
  data: T
}

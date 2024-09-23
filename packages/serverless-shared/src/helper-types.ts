export type DefaultErrorResponse = {
  errorCode?: number
  message: string
}

export type DefaultSuccessResponse<T> = {
  errorCode?: number
  message: string
  data: T
}

export type DefaultErrorResponse = {
  message: string
}

export type DefaultSuccessResponse<T> = {
  errorCode?: number
  message: string
  data: T
}

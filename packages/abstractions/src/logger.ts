type LogAttributes = {
  [key: string]: unknown
}

type LogAttributesWithMessage = LogAttributes & {
  message: string
}

type LogItemExtraInput = [Error | string] | LogAttributes[]

type LogItemMessage = string | LogAttributesWithMessage

export interface Logger {
  critical(input: LogItemMessage, ...extraInput: LogItemExtraInput): void

  debug(input: LogItemMessage, ...extraInput: LogItemExtraInput): void

  error(input: LogItemMessage, ...extraInput: LogItemExtraInput): void

  info(input: LogItemMessage, ...extraInput: LogItemExtraInput): void

  warn(input: LogItemMessage, ...extraInput: LogItemExtraInput): void
}

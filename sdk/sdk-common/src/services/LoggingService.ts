export class LoggingService {
  static log(...messages: unknown[]) {
    if (process.env.SDK_LOGGING_ENABLED === 'true') {
      console.log(...messages)
    }
  }

  static debug(...messages: unknown[]) {
    if (process.env.SDK_DEBUG_ENABLED === 'true') {
      console.info(...messages)
    }
  }
}

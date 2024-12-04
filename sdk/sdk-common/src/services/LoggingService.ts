export class LoggingService {
  static log(...messages: unknown[]) {
    if (process.env.SDK_LOGGING_ENABLED && process.env.SDK_LOGGING_ENABLED === 'true') {
      console.log(...messages)
    }
  }
}

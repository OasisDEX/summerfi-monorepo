export class LoggingService {
  static log(...messages: unknown[]) {
    if (process.env.SDK_LOGGING_ENABLED) {
      console.log(...messages)
    }
  }
}

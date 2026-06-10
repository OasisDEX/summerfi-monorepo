/**
 * Static logging helper whose `log`/`debug` output is gated by the `SDK_LOGGING_ENABLED` and
 * `SDK_DEBUG_ENABLED` environment variables; errors are always emitted.
 */
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

  static error(...messages: unknown[]) {
    console.error(...messages)
  }
}

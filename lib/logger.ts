import { getLoggingConfig } from "./config"

type LogLevel = "debug" | "info" | "warn" | "error"

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: Record<string, any>
}

class Logger {
  private config = getLoggingConfig()

  private formatLog(entry: LogEntry): string {
    const { timestamp, level, message, context } = entry
    
    if (this.config.format === "json") {
      return JSON.stringify({
        timestamp,
        level,
        message,
        ...context,
      })
    }

    // Pretty format for development
    const contextStr = context ? `\nContext: ${JSON.stringify(context, null, 2)}` : ""
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    }

    const formattedLog = this.formatLog(entry)

    // Console output
    if (this.config.enableConsole) {
      switch (level) {
        case "debug":
          console.debug(formattedLog)
          break
        case "info":
          console.info(formattedLog)
          break
        case "warn":
          console.warn(formattedLog)
          break
        case "error":
          console.error(formattedLog)
          break
      }
    }

    // File output (to be implemented)
    if (this.config.enableFile) {
      // TODO: Implement file logging
    }
  }

  debug(message: string, context?: Record<string, any>) {
    if (this.config.level === "debug") {
      this.log("debug", message, context)
    }
  }

  info(message: string, context?: Record<string, any>) {
    if (["debug", "info"].includes(this.config.level)) {
      this.log("info", message, context)
    }
  }

  warn(message: string, context?: Record<string, any>) {
    if (["debug", "info", "warn"].includes(this.config.level)) {
      this.log("warn", message, context)
    }
  }

  error(message: string, context?: Record<string, any>) {
    this.log("error", message, context)
  }
}

// Create singleton instance
const logger = new Logger()

export default logger 
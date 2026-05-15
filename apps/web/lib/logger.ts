type LogLevel = "info" | "warn" | "error" | "debug";

interface LogPayload {
  message: string;
  level: LogLevel;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: unknown;
}

/**
 * @class Logger
 * @description Omega Structured Logger — The forensic heart of SaidonClub OS.
 * Provides a consistent, structured logging system across all modules.
 * In development, it outputs high-visibility colorized logs.
 * In production, it produces structured JSON logs ready for ingestion by enterprise monitoring tools (Sentry, Datadog).
 */
class Logger {
  private isProduction = process.env.NODE_ENV === "production";

  private formatLog(level: LogLevel, message: string, context?: Record<string, unknown>, error?: unknown): LogPayload {
    return {
      message,
      level,
      timestamp: new Date().toISOString(),
      context,
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : error,
    };
  }

  private print(payload: LogPayload) {
    if (this.isProduction) {
      // In production, we could send this to a service like Sentry or Logtail
      // For now, we still use console but in a structured format
      console.log(JSON.stringify(payload));
    } else {
      const color = {
        info: "\x1b[32m", // Green
        warn: "\x1b[33m", // Yellow
        error: "\x1b[31m", // Red
        debug: "\x1b[34m", // Blue
      }[payload.level];
      const reset = "\x1b[0m";
      
      console.log(
        `${color}[${payload.level.toUpperCase()}]${reset} ${payload.timestamp} - ${payload.message}`,
        payload.context ? payload.context : "",
        payload.error ? payload.error : ""
      );
    }
  }

  /**
   * Registra un mensaje informativo.
   * @param message Mensaje a registrar.
   * @param context Objeto opcional con contexto adicional.
   */
  info(message: string, context?: Record<string, unknown>) {
    this.print(this.formatLog("info", message, context));
  }

  /**
   * Registra una advertencia.
   * @param message Mensaje a registrar.
   * @param context Objeto opcional con contexto adicional.
   */
  warn(message: string, context?: Record<string, unknown>) {
    this.print(this.formatLog("warn", message, context));
  }

  /**
   * Registra un error con su stack trace.
   * @param message Mensaje descriptivo del error.
   * @param context Contexto adicional del fallo.
   * @param error Objeto Error original.
   */
  error(message: string, context?: Record<string, unknown>, error?: unknown) {
    this.print(this.formatLog("error", message, context, error));
  }

  /**
   * Registra información de depuración (solo en desarrollo).
   * @param message Mensaje de debug.
   * @param context Contexto adicional.
   */
  debug(message: string, context?: Record<string, unknown>) {
    if (!this.isProduction) {
      this.print(this.formatLog("debug", message, context));
    }
  }
}

export const logger = new Logger();

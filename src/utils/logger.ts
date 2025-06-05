interface LogData {
  [key: string]: any;
}

interface ErrorLogData {
  error?: Error | unknown;
  code?: string;
  component?: string;
  userId?: string;
  functionName?: string;
  context?: LogData;
  stack?: string;
}

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

class Logger {
    /**
     * Logs debug information
     */
    static debug(message: string, data?: LogData) {
        Logger.log('debug', message, data);
    }

    /**
     * Logs general information
     */
    static info(message: string, data?: LogData) {
        Logger.log('info', message, data);
    }

    /**
     * Logs warning messages
     */
    static warn(message: string, data?: LogData) {
        Logger.log('warn', message, data);
    }

    /**
     * Logs error information with structured data
     */
    static error(
        message: string, 
        errorData: ErrorLogData = {}
    ) {
        const { error, code, component, userId, functionName, context, stack } = errorData;
        
        // Extract stack trace if available and not already provided
        const errorStack = stack || (error instanceof Error ? error?.stack : undefined);
        
        // Extract error message if available
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        const structuredError = {
            code,
            component,
            userId,
            functionName,
            context,
            errorMessage,
            stack: errorStack,
            timestamp: new Date().toISOString()
        };
        
        Logger.log('error', message, structuredError);
    }

    /**
     * Logs fatal errors that may cause application failure
     */
    static fatal(message: string, errorData: ErrorLogData = {}) {
        const enhancedData = {
            ...errorData,
            severity: 'FATAL',
            timestamp: new Date().toISOString()
        };
        
        Logger.log('fatal', message, enhancedData);
    }

    /**
     * Internal logging method
     */
    private static log(level: LogLevel, message: string, data?: any) {
        // Always collect logs, but only output in development by default
        const logData = {
            timestamp: new Date().toISOString(),
            level,
            message,
            data
        };
        
        // In development, log to console
        if (process.env.NODE_ENV === 'development') {
            switch (level) {
                case 'debug':
                    console.log(`[DEBUG] ${message}`, data);
                    break;
                case 'info':
                    console.log(`[INFO] ${message}`, data);
                    break;
                case 'warn':
                    console.warn(`[WARNING] ${message}`, data);
                    break;
                case 'error':
                case 'fatal':
                    console.error(`[${level.toUpperCase()}] ${message}`, data);
                    break;
            }
        }

        // In production, could send to external logging service
        // This is where you would integrate with services like Sentry, Datadog, etc.
        if (process.env.NODE_ENV === 'production') {
            // Currently just logging to console in production, but structured
            // Replace this with proper production logging integration
            console.log(JSON.stringify(logData));
        }
    }
}

export default Logger;
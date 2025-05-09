type LogData = any;

class Logger {
    static info(message: string, data?: LogData) {
        if (process.env.NODE_ENV === 'development') {
            console.log(message, data);
        }
    }

    static error(message: string,
        error?: any,
        code?: string,
        component?: string,
        userId?: string
    ) {
    if (process.env.NODE_ENV === 'development') {
        console.error(message, {
            error,
            code,
            component,
            userId
        });
    }
}
}

export default Logger;
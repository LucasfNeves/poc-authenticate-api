import winston from 'winston';
const logFormat = winston.format.printf(({ level, message, context, timestamp }) => {
    return `${timestamp} [${context}] ${level.toUpperCase()} ${message}`;
});
const winstonLogger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston.format.errors({ stack: true }), logFormat),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), logFormat),
        }),
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: winston.format.json(),
        }),
        new winston.transports.File({
            filename: 'logs/combined.log',
            format: winston.format.json(),
        }),
    ],
});
export class Logger {
    constructor(context) {
        this.context = context;
    }
    info(message) {
        winstonLogger.info(message, { context: this.context });
    }
    error(message, error) {
        winstonLogger.error(message, { context: this.context, error });
    }
    warn(message) {
        winstonLogger.warn(message, { context: this.context });
    }
    debug(message) {
        winstonLogger.debug(message, { context: this.context });
    }
}

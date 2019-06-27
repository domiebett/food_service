import * as winston from 'winston';

export const logger: winston.Logger = winston.createLogger();
const env = 'development';

if (env === 'development') {
    logger.add(new winston.transports.Console({
        handleExceptions: true
    }));
}

process.on('unhandledRejection', function (reason, p) {
    logger.warn('system level exceptions at, Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});

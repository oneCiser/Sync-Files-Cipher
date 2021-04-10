import winston from 'winston';

// winston format
const { printf } = winston.format;

// Define log format
const logFormat = printf(({ level, message }) => `${level}: ${message}`);

// simple log console with winston
const logger = winston.createLogger({
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.splat(), winston.format.colorize(),
        winston.format.simple()),
    }),
  ],
});


export { logger };
